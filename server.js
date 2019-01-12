const express = require('express');
const app = express();
const cors = require('cors');
// Allows route files to access db variable through req.db
const mongoExpress = require('express-mongo-db');

// Connect MLAB DB
app.use(mongoExpress(`mongodb://${process.env.MLAB_DB_USER}:${process.env.MLAB_DB_PASSWORD}@ds221990.mlab.com:21990/been-there-test`));
// app.use(mongoExpress('mongodb://127.0.0.1:27017/been-there-test'));

// Require routes defined in routes directory
const userRouter = require('./routes/user');
const mapRouter = require('./routes/map');

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

// Use routes defined in routes directory
app.use('/user', userRouter);
app.use('/map', mapRouter);

app.use(express.static('public'));

///// START SERVER
const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Coming at ya live...');
});
