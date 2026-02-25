/**
 * utils/generateToken.js
 *
 * Creates a signed JWT for a given user ID.
 * The token encodes the user's _id and is signed with the JWT_SECRET.
 * Expiry is controlled by JWT_EXPIRES_IN in .env (e.g., "7d").
 */

const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },                  // Payload: only the user ID
    process.env.JWT_SECRET,          // Secret key from environment
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = generateToken;
