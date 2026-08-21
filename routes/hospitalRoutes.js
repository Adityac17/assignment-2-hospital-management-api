const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const ensureAuthenticated = require('../middleware/auth');

// Public GET routes.
// NOTE: /available must be declared BEFORE /:id so it is not
// swallowed by the dynamic :id param.
router.get('/available', hospitalController.getAvailable);
router.get('/', hospitalController.getAll);
router.get('/:id', hospitalController.getById);

// Protected write routes (auth required)
router.post('/', ensureAuthenticated, hospitalController.create);
router.put('/:id', ensureAuthenticated, hospitalController.update);
router.delete('/:id', ensureAuthenticated, hospitalController.remove);

module.exports = router;
