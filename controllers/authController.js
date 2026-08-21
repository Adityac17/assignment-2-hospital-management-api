const passport = require('passport');
const User = require('../models/User');

// POST /register
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Input validation
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: 'username, email and password are required' });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters' });
    }

    // Duplicate check
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res
        .status(400)
        .json({ error: 'Username or email already in use' });
    }

    const user = await User.create({ username, email, password });

    return res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

// POST /login (passport-local)
exports.login = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .json({ error: 'username and password are required' });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(401)
        .json({ error: (info && info.message) || 'Authentication failed' });
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      return res.status(200).json({
        message: 'Logged in successfully',
        user: { id: user._id, username: user.username, email: user.email },
      });
    });
  })(req, res, next);
};

// POST /logout
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    return res.status(200).json({ message: 'Logged out successfully' });
  });
};
