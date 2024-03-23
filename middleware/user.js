var jwt = require('jsonwebtoken');
const { User } = require('../db');
const secretKey = 'secretKey';

async function userMiddleware(req, res, next) {
  const token = req.headers.authorization; // bearer token
  const words = token.split(' '); // ["Bearer", "token"]
  const jwtToken = words[1]; // token

  try {
    const user = jwt.verify(jwtToken, secretKey);
    if (user.username) {
      try {
        const userDetails = await User.findOne({ username: user.username });

        if (userDetails) {
          console.log('userDetails', userDetails);
          req.user = userDetails;
          next();
        } else {
          res.status(403).json({
            message: 'you are not authorized',
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      res.status(403).json({
        message: 'you are not authorized',
      });
    }
  } catch (error) {
    res.status(403).json({
      message: 'Invalid credentials',
    });
    console.log(error);
  }
}

module.exports = userMiddleware;
