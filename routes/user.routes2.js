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
jwtOptions.secretOrKey = process.env.JWT_SECRET;

///// ????
const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  console.log('payload received', jwt_payload);
  // REPLACE WITH DB CALL
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
  // Checks that the user has filled in all fields
  if(!req.body.email || !req.body.password) {
    return res.status(400).json({message: 'Please fill out all fields.'});
  }

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
        const payload = {_id: user._id};
        console.log('++++++++++++++++++');
        console.log('PAYLOAD', payload);
        const token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({message: "ok", token: token});
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
    next();
  } else {
    res.status(403).json({message: 'access denied'});
  }
}

router.get('/data', auth, (req, res) => {
  // verify the JWT generated for the user
  jwt.verify(req.token, jwtOptions.secretOrKey, (err, authorizedData) => {
    if(err) {
      return res.status(403).json({message: 'Please sign-in to access the requested content.'});
    } else {
      // If token is successfully verified, send the authorized data
      return res.status(200).json({
        message: 'success',
        authorizedData
      });
      console.log('Success! Connected to protected route.');
    }
  });
});

///// ?????
app.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
  res.json({message: "Success! You can not see this without a token"});
});

module.exports = router;
