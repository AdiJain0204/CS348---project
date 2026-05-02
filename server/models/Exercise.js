const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  muscleGroup: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number, required: true }
}, { timestamps: true });

// Index on muscleGroup to support dynamic dropdown query and report filtering
exerciseSchema.index({ muscleGroup: 1 });

module.exports = mongoose.model('Exercise', exerciseSchema);