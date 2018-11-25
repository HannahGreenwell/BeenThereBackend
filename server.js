const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded());

const MongoClient = require('mongodb').MongoClient;
let db;

MongoClient.connect('mongodb://127.0.0.1:27017', (err, client) => {
  if(err) return console.warn(err);

  db = client.db('been-there-test');
});

const server = app.listen(3000, () => {
  console.log('Coming at ya live from port 3000...');
});

// Testing
module.exports = server;

///// SHOW USER'S BEEN THERE MAP
app.get('/beenthere/:id', (req, res) => {
  const {id} = req.params;

  db.collection('users').findOne({user_id: parseInt(id)}, (err, result) => {
    if(err) return console.warn(err);
    res.json(result.beenThereMap);
  });
});

///// ADD PIN TO BEEN THERE MAP
app.post('/beenthere/:id/add', (req, res) => {

});

///// SHOW USER'S WISHLIST MAP
app.get('/wishlist/:id', (req, res) => {
  const {id} = req.params;

  db.collection('users').findOne({user_id: parseInt(id)}, (err, result) => {
    if(err) return console.warn(err);
    res.json(result);
  });
});

///// SHOW CITY SEARCH RESULTS
app.get('/search/:city', (req, res) => {
  const {city} = req.params;

  // Get array of current user's friends
  db.collection('users').findOne({user_id: 1}, (err, result) => {
    if(err) return console.warn(err);
    const friends = result.friends;

    // Get friends who have been to the query city
    db.collection('users').find(
      {
        user_id: {$in: friends},
        "beenThereMap.city": city
      })
      .toArray((err, results) => {
      if(err) return console.warn(err);
      res.json(results);
    });
  });
});
