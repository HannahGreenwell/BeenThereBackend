const express = require('express');
const app = express();
const cors = require('cors');
const passport = require('passport');


///// Allows route files to access db variable through req.db
const mongoExpress = require('express-mongo-db');
// app.use(mongoExpress('mongodb://127.0.0.1:27017/been-there-test'));

app.use(mongoExpress(`mongodb://${process.env.MLAB_DB_USER}:${process.env.MLAB_DB_PASSWORD}@ds221990.mlab.com:21990/been-there-test`));

console.log(process.env.MLAB_DB_USER, process.env.MLAB_DB_PASSWORD);

const user = require('./routes/user.routes');

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use('/user', user);

app.use(express.static('public'));

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
const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Coming at ya live...');
});
