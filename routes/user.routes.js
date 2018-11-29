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
      return res.status(500).json({message: err});
    } else {
      req.db.collection('users').insert({email: req.body.email, password: hash}, (err, result) => {
        if(err) {
          return res.status(500).json({message: err});
        } else {
          console.log(result);
          res.status(200).json({succes: 'New user has been created'});
        }
      });
    }
  })
});

///// POST TO SIGNIN
router.post("/signin", (req, res, next) => {

  req.db.collection('users').findOne({email: req.body.email}, (err, result) => {
    const user = result;

    // Checks that the email address exists in the DB
    if(!user) {
       res.status(401).json({message: 'Please check your email and password.'});
       return next();
    }

    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if(result) {
        // Handle good credentials
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

  if(typeof header !== 'undefined') {
    const bearer = header.split(' ');
    const token = bearer[1];

    req.token = token;

    // verify the JWT generated for the user
    jwt.verify(req.token, SECRET, (err, authorizedData) => {

      // Handle token that can't be verified
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
    return res.status(403).json({message: 'access denied'});  // Handle requests with no auth header
  }
}


///// PROTECTED ROUTES
router.get('/beenthere', auth, (req, res) => {
  const mapData = req.current_user.beenThereMap;
  let pins = [];

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

  res.json(pins);
});

router.get('/pin/:city/:name', auth, (req, res) => {
  const {city, name} = req.params;

  const mapData = req.current_user.beenThereMap;
  const cityData = mapData.find(c => c.city === city);
  const pin = cityData.pins.find(pin => pin.name === name);

  res.json(pin);
});

///// POST TO CREATE A NEW PIN
router.post('/pin', auth, (req, res) => {
  console.log(req.body);

  const {name, category, description, images, lat, lng, city} = req.body;
  const userData = req.current_user;

  const cityData = userData.beenThereMap.find(c => c.city === city);

  const newPin = {
    name,
    description,
    category,
    images,
    lat,
    lng
  };

  if(cityData) {
    cityData.pins.push(newPin);
  } else {
    userData.beenThereMap.push(
      {
        city,
        pins: [newPin]
      }
    );
  }

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

// router.get('/data', auth, (req, res) => {
//   res.json(req.current_user);
// });

module.exports = router;
