const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const mongoose = require('mongoose');
const sanitize = require('mongo-sanitize');

// Get all workouts
router.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find().populate('exercises');
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Report route - MUST be before /:id route
router.get('/report/stats', async (req, res) => {
  try {
    const { startDate, endDate, muscleGroup } = req.query;

    let workouts = await Workout.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).populate('exercises');

    // Filter by muscle group if selected
    if (muscleGroup) {
      workouts = workouts.filter(workout =>
        workout.exercises.some(ex => ex.muscleGroup === muscleGroup)
      );
    }

    const totalWorkouts = workouts.length;
    const avgDuration = totalWorkouts > 0
      ? workouts.reduce((sum, w) => sum + w.duration, 0) / totalWorkouts
      : 0;

    res.json({ workouts, totalWorkouts, avgDuration });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one workout
router.get('/:id', async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id).populate('exercises');
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a workout
router.post('/', async (req, res) => {
  try {
    const workout = new Workout({
      name: sanitize(req.body.name),
      date: sanitize(req.body.date),
      duration: sanitize(req.body.duration),
      notes: sanitize(req.body.notes),
      exercises: req.body.exercises
    });
    const newWorkout = await workout.save();
    res.status(201).json(newWorkout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a workout
router.put('/:id', async (req, res) => {
  try {
    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      sanitize(req.body),
      { new: true }
    );
    res.json(workout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a workout
router.delete('/:id', async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.json({ message: 'Workout deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;