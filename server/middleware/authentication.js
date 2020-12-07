const jwt = require('jsonwebtoken');
const config = require('../config/settings');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      error: new Error('Unauthorized')
    });
  }

  jwt.verify(token.toString(), config.Authentication.jwtAppSecret, (err, user) => {
    if (err) {
      return res.status(401).json({
        error: new Error('Unauthorized')
      });
    }

    req.user = user;
    next();
  });
};