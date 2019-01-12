const express = require('express');
const router = express.Router();
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

///// PROTECTED ROUTES
// CREATE PLACE
router.post('/place', auth, parser.single('image'), (req, res) => {
  // Get uploaded image url from req.file
  const image = req.file.url;
  // Get form inputs from req.body
  const {name, address, category, description} = req.body;
  const lat = parseFloat(req.body.lat);
  const lng = parseFloat(req.body.lng);

  // Create a new pin object using the form input
  const newPlace = {
    name,
    address,
    description,
    category,
    image,
    lat,
    lng
  };

  // Update the user's document
  req.db.collection('users').updateOne(
    // Find the correct document by _id
    {_id: req.current_user._id},
    // Push the new place object onto the user's places array
    {$push: {places: newPlace}},
    (err, result) => {
      if(err) {
        return res.json({error: err});
      } else {
        res.json(newPlace);
      }
    }
  );
});

// READ ALL PLACES
router.get('/places', auth, (req, res) => {
  // Get the user's map data from req.current_user
  let {places} = req.current_user;

  // Send an empty array back to user's with no map data
  if (!places) {
    places = [];
  }

  // Return an array of the pins (or an empty array if the user has no pins)
  res.json(places);
});

// UPDATE PLACE (without image)
router.put('/place/:lat/:lng', auth, (req, res) => {
  // Get the place's new values
  const {name, address, category, description} = req.body;
  const lat = parseFloat(req.body.lat);
  const lng = parseFloat(req.body.lng);

  req.db.collection('users').findOneAndUpdate(
    {
      _id: req.current_user._id,
      "places.lat": lat,
      "places.lng": lng
    },
    {
      $set: {
      "places.$.name": name,
      "places.$.address": address,
      "places.$.category": category,
      "places.$.description": description,
    }},
    { returnOriginal: false },
    (error, result) => {
      if (error) return res.json({error: error});

      const place = result.value.places.find(p => p.lat === lat && p.lng === lng);
      res.json(place);
    }
  );
});

// UPDATE PLACE (with image)
// router.put('/place/:lat/:lng', auth, parser.single('image'), (req, res) => {
//   // Get the place's previous lat and lng from req.params
//   const prevLat = parseFloat(req.params.lat);
//   const prevLng = parseFloat(req.params.lng);
//   // Get the place's new values
//   const image = req.file.url;
//   const {name, category, description} = req.body;
//   const lat = parseFloat(req.body.lat);
//   const lng = parseFloat(req.body.lng);
//
//   req.db.collection('users').findOneAndUpdate(
//     {
//       _id: req.current_user._id,
//       "places.lat": prevLat,
//       "places.lng": prevLng
//     },
//     {
//       $set: {
//       "places.$.name": name,
//       "places.$.category": category,
//       "places.$.description": description,
//       "places.$.image": image,
//       "places.$.lat": lat,
//       "places.$.lng": lng
//     }},
//     { returnOriginal: false },
//     (error, result) => {
//       if (error) return res.json({error: error});
//
//       const place = result.value.places.find(p => p.lat === lat && p.lng === lng);
//       res.json(place);
//     }
//   );
// });

// DELETE PLACE
router.delete('/place/:lat/:lng', auth, (req, res) => {
  // Get the selected place's lat and lng from req.params
  const lat = parseFloat(req.params.lat);
  const lng = parseFloat(req.params.lng);

  // Delete the selected place from the user's places array
  req.db.collection('users').findOneAndUpdate(
    { _id: req.current_user._id },
    { $pull: { places: { lat: lat, lng: lng }}},
    { returnOriginal: false },
    (error, result) => {
      if (error) return res.json({error: error});

      res.json({status: "ok"});
    }
  );
});

module.exports = router;
