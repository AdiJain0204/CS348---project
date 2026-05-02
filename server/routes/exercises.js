const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');

// Get all unique muscle groups
router.get('/muscle-groups', async (req, res) => {
  try {
    const muscleGroups = await Exercise.distinct('muscleGroup');
    res.json(muscleGroups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all exercises
router.get('/', async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create an exercise
router.post('/', async (req, res) => {
  const exercise = new Exercise({
    name: req.body.name,
    muscleGroup: req.body.muscleGroup,
    sets: req.body.sets,
    reps: req.body.reps,
    weight: req.body.weight
  });
  try {
    const newExercise = await exercise.save();
    res.status(201).json(newExercise);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;