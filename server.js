const express = require('express');
const app = express();
const cors = require('cors');
const passport = require('passport');


///// Allows route files to access db variable through req.db
const mongoExpress = require('express-mongo-db');
app.use(mongoExpress('mongodb://127.0.0.1:27017/been-there-test'));

const user = require('./routes/user.routes');

// ///// Passport JWT Strategy
// const ExtractJwt = passportJWT.ExtractJwt;
// const JwtStrategy = passportJWT.Strategy;
//
// let jwtOptions = {};
// jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// jwtOptions.secretOrKey = 'tasmanianDevil';
//
// const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
//   console.log('payload received', jwt_payload);
//   const user = users[_.findIndex(users, {id: jwt_payload.id})];
//   if(user) {
//     next(null, user);
//   } else {
//     next(null, false);
//   }
// });
//
// passport.use(strategy);

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use('/user', user);


///// POST TO LOGIN
// app.post("/login", (req, res, next) => {
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
//   db.collection('users').findOne({email}, (err, result) => {
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

app.get("/secret", passport.authenticate('jwt', {session: false}), function(req, res) {
  res.json("Success! You can not see this without a token");
});

//
// app.post('/signup', (req, res) => {
//   bcrypt.hash(req.body.password, 10, (err, hash) => {
//     if(err) {
//       return res.status(500).json({
//         error: err
//       });
//     } else {
//       db.collection('users').insertOne({email: req.body.email, password: hash}, (err, result) => {
//         if(err) {
//           return res.status(500).json({error: err});
//         } else {
//           console.log(result);
//           res.status(200).json({succes: 'New user has been created'});
//         }
//       });
//     }
//   })
// });


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
