const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectID;

const SECRET = process.env.JWT_SECRET;

// Function for checking authorization before accessing protected routes
const auth = (req, res, next) => {

  // Get the authorization header
  const header = req.headers['authorization'];

  // Check that authorization header exists
  if(typeof header !== 'undefined') {

    // Remove the JWT from the authorization header
    const bearer = header.split(' ');
    const token = bearer[1];
    req.token = token;

    // Verify the JWT and extract the user's id
    jwt.verify(req.token, SECRET, (err, authorizedData) => {
      if(err){
        // If the token can't be verified (e.g. expired token) return 403 status and error msg
        return res.status(403).json({message: 'Please login to access that page'});
      } else {
        // If token is successfully verified, use token to find the logged-in user
        req.db.collection('users').findOne({_id: ObjectId(authorizedData._id)}, (err, result) => {
          // If the user can not be found, return a 404 status and error msg
          if(err) return res.status(404).json({message: 'User not found'});

          // Set the current user into req.current_user
          req.current_user = result;
          // Run the actual route handler by calling next()
          next();
        });
      }
    });
  } else {
    // If no authorization header was found, return 403 status and error msg
    return res.status(403).json({message: 'Access Denied'});
  }
}

module.exports = auth;
