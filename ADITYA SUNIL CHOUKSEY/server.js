require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

const logger = require('./middleware/logger');
const authRoutes = require('./routes/authRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(logger);

// Session (required for passport-local session auth)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Hospital Management API' });
});
app.use('/', authRoutes);
app.use('/hospitals', hospitalRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ error: 'Internal server error' });
});

// Connect DB, then start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
