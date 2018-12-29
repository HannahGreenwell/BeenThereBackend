const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');

const auth = require('../authorization.js');

const SECRET = process.env.JWT_SECRET;

// https://medium.freecodecamp.org/how-to-allow-users-to-upload-images-with-node-express-mongoose-and-cloudinary-84cefbdff1d9
///// CLOUDINARY SET-UP
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "demo",
  allowedFormats: ["jpg", "png"],
  transformation: [{width: 500, height: 500, crop: "limit"}]
});

const parser = multer({storage: storage});

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

///// PROTECTED ROUTES
// GET USER'S SAVED PLACES
router.get('/map', auth, (req, res) => {
  // Get the user's map data from req.current_user
  let {places} = req.current_user;

  // Send an empty array back to user's with no map data
  if (!places) {
    places = [];
  }

  // Return an array of the pins (or an empty array if the user has no pins)
  res.json(places);
});

///// POST TO CREATE A NEW PIN
router.post('/pin', auth, parser.single('image'), (req, res) => {
  // Get uploaded image url from req.file
  console.log(req.body);
  console.log(req.file);
  const image = req.file.url;
  // Get form inputs from req.body
  const {name, category, description, city} = req.body;
  const lat = parseFloat(req.body.lat);
  const lng = parseFloat(req.body.lng);
  // Get the full user document from req.current_user
  const userData = req.current_user;

  // Create a new pin object using the form input
  const newPin = {
    name,
    description,
    category,
    image,
    lat,
    lng,
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

router.delete('/pin/:name', auth, (req, res) => {
  console.log('Request ', req.params);
  res.json({"status": "ok"});
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
