const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
  notes: { type: String },
  exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }]
}, { timestamps: true });

// Index on date to support report queries filtered by date range
workoutSchema.index({ date: 1 });

// Index on date + duration to support report stats queries
workoutSchema.index({ date: 1, duration: 1 });

module.exports = mongoose.model('Workout', workoutSchema);