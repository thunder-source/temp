var jwt = require('jsonwebtoken');
const secretKey = 'secretKey';
// Middleware for handling auth

function adminMiddleware(req, res, next) {
  const token = req.headers.authorization; // bearer token
  const words = token.split(' '); // ["Bearer", "token"]
  const jwtToken = words[1]; // token

  try {
    const user = jwt.verify(jwtToken, secretKey);
    if (user.username) {
      next();
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

module.exports = adminMiddleware;
