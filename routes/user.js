const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

// SIGN-UP
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
      req.db.collection('users').insert({email: req.body.email, password: hash, places:[]}, (err, result) => {
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

// SIGN-IN
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

module.exports = router;
