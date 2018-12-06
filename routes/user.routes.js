const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectID;

const SECRET = process.env.JWT_SECRET;

///// POST TO SIGNUP
router.post('/signup', (req, res) => {
  // Checks that the user has filled in all fields
  if(!req.body.email || !req.body.password) {
    return res.status(400).json({message: 'Please fill out all fields.'});
  }

  // Create hashed password
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if(err) {
      return res.status(500).json({message: 'Sorry an error occurred. Please try again.'});
    } else {
      // Add new user to the DB
      req.db.collection('users').insert({email: req.body.email, password: hash}, (err, result) => {
        if(err) {
          return res.status(500).json({message: 'Sorry an error occurred. Please try again.'});
        } else {
          // Create and return JWT for successful sign-ups
          jwt.sign(
            {_id: result.ops[0]._id},
            SECRET,
            {expiresIn: '22h'},
            (err, token) => {
              if(err) {
                console.warn(err);
              } else {
                res.json({message: "Success", token: token});
              }
            }
          );
        }
      });
    }
  })
});

///// POST TO SIGNIN
router.post("/signin", (req, res, next) => {

  // Find the correct user using the email address provided
  req.db.collection('users').findOne({email: req.body.email}, (err, result) => {
    const user = result;

    // Check that the email address exists in the DB
    if(!user) {
       res.status(401).json({message: 'Please check your email and password.'});
       return next();
    }

    // Compare the password provided with the user's hashed password
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if(result) {
        // Handle correct password
        jwt.sign(
          {_id: user._id},
          SECRET,
          {expiresIn: '22h'},
          (err, token) => {
            if(err) {
              console.warn(err);
            } else {
              res.json({message: "Success", token: token});
            }
          })
      } else {
        // Handle incorrect password
        res.status(401).json({message: 'Please check your email and password.'});
      }
    });
  });
});

// Check authorization before accessing protected routes
const auth = (req, res, next) => {

  const header = req.headers['authorization'];

  // Check that authorization header exists
  if(typeof header !== 'undefined') {
    const bearer = header.split(' ');
    const token = bearer[1];

    req.token = token;

    // Verify the JWT generated for the user
    jwt.verify(req.token, SECRET, (err, authorizedData) => {

      // Handle token that can't be verified (e.g. expired token)
      if(err){
        return res.status(403).json({message: 'Please login to access that page'});
      } else {
        // If token is successfully verified, use token to find the logged-in user
        // Set the user into req.current_user, and run the actual route handler by calling next()
        req.db.collection('users').findOne({_id: ObjectId(authorizedData._id)}, (err, result) => {

          if(err) return res.status(404).json({message: 'User not found'});

          req.current_user = result;
          next();
        });
      }
    });
  } else {
    // Handle requests with no authorization header
    return res.status(403).json({message: 'Access Denied'});
  }
}


///// PROTECTED ROUTES
router.get('/beenthere', auth, (req, res) => {
  const mapData = req.current_user.beenThereMap;
  let pins = [];

  // Avoid errors for users who do not have any map data
  if(mapData) {
    mapData.forEach(city => {
      city.pins.forEach(pin => {
        pins.push({
          city: city.city,
          name: pin.name,
          lat: pin.lat,
          lng: pin.lng
        });
      });
    });
  }

  res.json(pins);
});

router.get('/pin/:city/:name', auth, (req, res) => {
  const {city, name} = req.params;

  const mapData = req.current_user.beenThereMap;

  // Find the correct city object within the map data
  const cityData = mapData.find(c => c.city === city);

  // Find the correct pin object within the city object
  const pin = cityData.pins.find(pin => pin.name === name);

  res.json(pin);
});

///// POST TO CREATE A NEW PIN
router.post('/pin', auth, (req, res) => {
  console.log(req.body);

  const {name, category, description, images, lat, lng, city} = req.body;
  const userData = req.current_user;

  // Create a new pin object using the user input
  const newPin = {
    name,
    description,
    category,
    images,
    lat,
    lng
  };

  // Check whether the user has a map object in their document
  if(userData.beenThereMap) {
    // Find the correct city object within the map data
    const cityData = userData.beenThereMap.find(c => c.city === city);

    // Check whether the city already exists within the user's map data
    if(cityData) {
      // Add the new pin to the existing city object
      cityData.pins.push(newPin);
    } else {
      // Add a new city object including the new pin to user's map data
      userData.beenThereMap.push(
        {
          city,
          pins: [newPin]
        }
      );
    }
  } else {
    // Add a map object, city object and pin object to new user's document
    userData.beenThereMap = [newPin];
  }


  // Update the user's document
  req.db.collection('users').updateOne(
    {_id: userData._id},
    userData,
    {upsert: true},
    (err, result) => {
      if(err) {
        return res.json({error: err});
      } else {
        res.json(
          {
            newPin,
            pinToPush: {
              city,
              name,
              lat,
              lng
            }
          }
        );
      }
    }
  )
});

///// SHOW CITY SEARCH RESULTS
// app.get('/search/:city', (req, res) => {
//   const {city} = req.params;
//
//   // Get array of current user's friends
//   db.collection('users').findOne({user_id: 1}, (err, result) => {
//     if(err) return console.warn(err);
//     const friends = result.friends;
//
//     // Get friends who have been to the query city
//     db.collection('users').find(
//       {
//         user_id: {$in: friends},
//         "beenThereMap.city": city
//       })
//       .toArray((err, results) => {
//       if(err) return console.warn(err);
//       res.json(results);
//     });
//   });
// });

module.exports = router;
