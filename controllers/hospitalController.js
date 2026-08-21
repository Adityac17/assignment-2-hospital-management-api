const mongoose = require('mongoose');
const Hospital = require('../models/Hospital');

// Validate ObjectId helper
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /hospitals
exports.getAll = async (req, res, next) => {
  try {
    const hospitals = await Hospital.find().sort({ createdAt: -1 });
    return res.status(200).json(hospitals);
  } catch (err) {
    next(err);
  }
};

// GET /hospitals/available - hospitals with availableBeds > 0
exports.getAvailable = async (req, res, next) => {
  try {
    const hospitals = await Hospital.find({ availableBeds: { $gt: 0 } }).sort({
      availableBeds: -1,
    });
    return res.status(200).json(hospitals);
  } catch (err) {
    next(err);
  }
};

// GET /hospitals/:id
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid hospital ID' });
    }
    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }
    return res.status(200).json(hospital);
  } catch (err) {
    next(err);
  }
};

// POST /hospitals
exports.create = async (req, res, next) => {
  try {
    const { name, city, totalBeds, availableBeds } = req.body;

    // Input validation
    if (!name || !city || totalBeds == null || availableBeds == null) {
      return res.status(400).json({
        error: 'name, city, totalBeds and availableBeds are required',
      });
    }
    if (typeof totalBeds !== 'number' || typeof availableBeds !== 'number') {
      return res
        .status(400)
        .json({ error: 'totalBeds and availableBeds must be numbers' });
    }
    if (totalBeds < 0 || availableBeds < 0) {
      return res.status(400).json({ error: 'Bed counts cannot be negative' });
    }
    if (availableBeds > totalBeds) {
      return res
        .status(400)
        .json({ error: 'availableBeds cannot exceed totalBeds' });
    }

    const hospital = await Hospital.create({
      name,
      city,
      totalBeds,
      availableBeds,
    });
    return res.status(201).json(hospital);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

// PUT /hospitals/:id
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid hospital ID' });
    }

    const { totalBeds, availableBeds } = req.body;
    if (
      totalBeds != null &&
      availableBeds != null &&
      availableBeds > totalBeds
    ) {
      return res
        .status(400)
        .json({ error: 'availableBeds cannot exceed totalBeds' });
    }

    const hospital = await Hospital.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }
    return res.status(200).json(hospital);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

// DELETE /hospitals/:id
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid hospital ID' });
    }
    const hospital = await Hospital.findByIdAndDelete(id);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }
    return res
      .status(200)
      .json({ message: 'Hospital deleted successfully', id });
  } catch (err) {
    next(err);
  }
};
