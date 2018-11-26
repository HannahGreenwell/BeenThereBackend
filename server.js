const _ = require('lodash');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const passport = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const users = [
  {
    id: 1,
    name: 'Hannah',
    password: '%2yx4'
  },
  {
    id: 2,
    name: 'Jesica',
    password: 'chicken'
  }
];

///// DATABASE
const MongoClient = require('mongodb').MongoClient;
let db;

MongoClient.connect('mongodb://127.0.0.1:27017', (err, client) => {
  if(err) return console.warn(err);

  db = client.db('been-there-test');
});

///// Passport JWT Strategy
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

const app = express();
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());


///// POST TO LOGIN
app.post("/login", (req, res) => {
  console.log(req.body);

  let name;
  let password;

  if(req.body.name && req.body.password) {
    name = req.body.name;
    password = req.body.password;
  }

  // Replace with DB call
  const user = users[_.findIndex(users, {name: name})];

  // db.collection('users').findOne({email}, (err, result) => {
    // if(err) return console.warn(err);

    // const user = result;
    //
    // if(!user) {
    //   res.status(401).json({message: 'no such user found'});
    // }
    //
    // if(user.password === req.body.password) {
    //   const payload = {id: user.id};
    //   const token = jwt.sign(payload, jwtOptions.secretOrKey);
    //   res.json({message: "ok", token: token});
    // } else {
    //   res.status(401).json({message: 'passwords did not match'});
    // }
  // });

  if(!user) {
    res.status(401).json({message: 'no such user found'});
  }

  if(user.password === req.body.password) {
    // from now on we'll identify the user by the id and the id
    // is the only personalised value that goes into the token
    const payload = {id: user.id};
    const token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.json({message: "ok", token: token});
  } else {
    res.status(401).json({message: 'passwords did not match'});
  }
});

app.get("/secret", passport.authenticate('jwt', {session: false}), function(req, res) {
  res.json("Success! You can not see this without a token");
});


// ///// SHOW USER'S BEEN THERE MAP
// app.get('/beenthere/:id', (req, res) => {
//   const {id} = req.params;
//
//   db.collection('users').findOne({user_id: parseInt(id)}, (err, result) => {
//     if(err) return console.warn(err);
//     res.json(result.beenThereMap);
//   });
// });
//
// ///// ADD PIN TO BEEN THERE MAP
// app.post('/beenthere/:id/add', (req, res) => {
//
// });
//
// ///// SHOW USER'S WISHLIST MAP
// app.get('/wishlist/:id', (req, res) => {
//   const {id} = req.params;
//
//   db.collection('users').findOne({user_id: parseInt(id)}, (err, result) => {
//     if(err) return console.warn(err);
//     res.json(result);
//   });
// });
//
// ///// SHOW CITY SEARCH RESULTS
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


///// START SERVER
const server = app.listen(3000, () => {
  console.log('Coming at ya live from port 3000...');
});
