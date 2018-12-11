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
  // Arguments: user input password, number of 'salt rounds' and callback
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if(err) {
      // If an error occurs during password hashing, return status 500 and error msg
      return res.status(500).json({message: 'Sorry an error occurred. Please try again.'});
    } else {
      // Add the new user to the DB
      req.db.collection('users').insert({email: req.body.email, password: hash}, (err, result) => {
        if(err) {
          // If an error occurs during insertion, return status 500 and error msg
          return res.status(500).json({message: 'Sorry an error occurred. Please try again.'});
        } else {
          // Create/sign and return JWT for successful sign-ups
          jwt.sign(
            // _id from inserted document
            {_id: result.ops[0]._id},
            // JWT secret
            SECRET,
            // Duration of validity
            {expiresIn: '22h'},
            (err, token) => {
              if(err) {
                console.warn(err);
              } else {
                // Return success message and the JWT
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
      // If no user was found, return a 401 status and error msg
      res.status(401).json({message: 'Please check your email and password.'});
      return next();
    }

    // Compare the password provided with the user's stored hashed password
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if(result) {
        // If the user entered good credentials, sign JWT and return it
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
        // If the user entered bad credentials, return 401 status and error msg
        res.status(401).json({message: 'Please check your email and password.'});
      }
    });
  });
});


///// CHECK AUTHORIZATION
// Function for checking authorization before accessing protected routes
const auth = (req, res, next) => {

  // Get the authorization header
  const header = req.headers['authorization'];

  // Check that authorization header exists
  if(typeof header !== 'undefined') {

    // Remove the JWT from the authorization header
    const bearer = header.split(' ');
    const token = bearer[1];
    req.token = token;

    // Verify the JWT and extract the user's id
    jwt.verify(req.token, SECRET, (err, authorizedData) => {
      if(err){
        // If the token can't be verified (e.g. expired token) return 403 status and error msg
        return res.status(403).json({message: 'Please login to access that page'});
      } else {
        // If token is successfully verified, use token to find the logged-in user
        req.db.collection('users').findOne({_id: ObjectId(authorizedData._id)}, (err, result) => {
          // If the user can not be found, return a 404 status and error msg
          if(err) return res.status(404).json({message: 'User not found'});

          // Set the current user into req.current_user
          req.current_user = result;
          // Run the actual route handler by calling next()
          next();
        });
      }
    });
  } else {
    // If no authorization header was found, return 403 status and error msg
    return res.status(403).json({message: 'Access Denied'});
  }
}

///// PROTECTED ROUTES
// GET USER'S SAVED PLACES
router.get('/beenthere', auth, (req, res) => {
  // Get the user's map data from req.current_user
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

  // Return an array of the pins (or an empty array if the user has no pins)
  res.json(pins);
});

// GET CLICKED PIN'S DETAILS
router.get('/pin/:city/:name', auth, (req, res) => {
  // Get the selected city and place name from params
  const {city, name} = req.params;

  // Get the user's map data from req.current_user
  const mapData = req.current_user.beenThereMap;

  // Find the correct city object within the map data
  const cityData = mapData.find(c => c.city === city);

  // Find the correct pin object within the city object
  const pin = cityData.pins.find(pin => pin.name === name);

  // Return the clicked pin object
  res.json(pin);
});

///// POST TO CREATE A NEW PIN
router.post('/pin', auth, (req, res) => {
  // Get form inputs from req.body
  const {name, category, description, images, lat, lng, city} = req.body;

  // Get the full user document from req.current_user
  const userData = req.current_user;

  // Create a new pin object using the form input
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
      // If the city already exists, add the new pin to the city object
      cityData.pins.push(newPin);
    } else {
      // If the city does not exist, add a new city object including the new pin to user's map data
      userData.beenThereMap.push(
        {
          city,
          pins: [newPin]
        }
      );
    }
  } else {
    // If the user does not have a map object, add a map object, city object and pin object their document
    userData.beenThereMap = [newPin];
  }


  // Update the user's document
  req.db.collection('users').updateOne(
    // Find the correct document by _id
    {_id: userData._id},
    // Update the document with the userData
    userData,
    {upsert: true},
    (err, result) => {
      if(err) {
        // If an error occurs during the update, return the error
        return res.json({error: err});
      } else {
        // If the update was successful, return the new pin and the new pin's details
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
