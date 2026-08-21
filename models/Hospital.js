const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    totalBeds: {
      type: Number,
      required: [true, 'Total beds is required'],
      min: [0, 'Total beds cannot be negative'],
    },
    availableBeds: {
      type: Number,
      required: [true, 'Available beds is required'],
      min: [0, 'Available beds cannot be negative'],
      validate: {
        validator: function (value) {
          return value <= this.totalBeds;
        },
        message: 'Available beds cannot exceed total beds',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hospital', hospitalSchema);
