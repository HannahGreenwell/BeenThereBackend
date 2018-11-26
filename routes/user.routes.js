const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const passportJWT = require('passport-jwt');

///// Passport JWT Strategy
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'tasmanianDevil';

const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  console.log('payload received', jwt_payload);
  const user = users[_.findIndex(users, {id: jwt_payload.id})];
  if(user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);


///// POST TO SIGNUP
router.post('/signup', (req, res) => {
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

///// POST TO LOGIN
// router.post("/signin", (req, res, next) => {
//   console.log(req.body);
//
//   let email;
//   let password;
//
//   if(req.body.email && req.body.password) {
//     email = req.body.email;
//     password = req.body.password;
//   }
//
//   req.db.collection('users').findOne({email}, (err, result) => {
//     const user = result;
//
//     if(!user) {
//        res.status(401).json({message: 'no such user found'});
//        return next();
//     }
//
//     if(user.password === req.body.password) {
//       const payload = {id: user.id};
//       const token = jwt.sign(payload, jwtOptions.secretOrKey);
//       res.json({message: "ok", token: token});
//     } else {
//       res.status(401).json({message: 'passwords did not match'});
//     }
//   });
// });
router.post("/signin", (req, res, next) => {

  req.db.collection('users').findOne({email: req.body.email}, (err, result) => {
    const user = result;

    if(!user) {
       res.status(401).json({message: 'no such user found'});
       return next();
    }

    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if(result) {
        const payload = {id: user.id};
        const token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({message: "ok", token: token});
      } else {
        res.status(401).json({message: 'passwords did not match'});
      }
    });
  });
});

module.exports = router;
