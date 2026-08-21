// Authentication guard for protected routes
module.exports = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized. Please log in.' });
};
