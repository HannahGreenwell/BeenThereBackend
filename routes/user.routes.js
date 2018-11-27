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

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if(err) {
      return res.status(500).json({
        error: err
      });
    } else {
      req.db.collection('users').insert({email: req.body.email, password: hash}, (err, result) => {
        if(err) {
          return res.status(500).json({error: err});
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
       res.status(401).json({message: 'no such user found'});
       return next();
    }

    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if(result) {
        // Handle good credentials
        jwt.sign(
          {_id: user._id},
          SECRET,
          {expiresIn: '1h'},
          (err, token) => {
            if(err) {
              console.warn(err);
            } else {
              res.json({message: "Success", token: token});
            }
          })
      } else {
        // Handle incorrect password
        res.status(401).json({message: 'passwords did not match'});
      }
    });
  });
});

const auth = (req, res, next) => {
  const header = req.headers['authorization'];

  if(typeof header !== 'undefined') {
    const bearer = header.split(' ');
    const token = bearer[1];

    req.token = token;

    // verify the JWT generated for the user
    jwt.verify(req.token, SECRET, (err, authorizedData) => {
      if( err ){
        return res.status(403).json({message: 'Please sign-in to access the requested content.'});
      } else {
        // If token is successfully verified, use it to find the logged-in user in the DB,
        // set that user into req.current_user, and run the actual route handler by calling next()
        req.db.collection('users').findOne({_id: ObjectId(authorizedData._id)}, (err, result) => {

          if(err) return res.status(404).json({message: 'User not found (token error).'});

          req.current_user = result;
          next();
        });
      }
    });

  } else {
    return res.status(403).json({message: 'access denied'});  // No auth header present
  }
}


///// GET TO PROTECTED ROUTE
router.get('/data', auth, (req, res) => {
  res.json({data: 'heres ya data', user: req.current_user});
});

router.get('/beenthere', auth, (req, res) => {
  res.json(req.current_user);
});

module.exports = router;
