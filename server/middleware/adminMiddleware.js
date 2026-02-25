/**
 * middleware/adminMiddleware.js
 *
 * Must be used AFTER the `protect` middleware.
 * Checks that the authenticated user has the 'admin' role.
 * Non-admin users receive a 403 Forbidden response.
 */

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied. Admin privileges required.',
  });
};

module.exports = { adminOnly };
