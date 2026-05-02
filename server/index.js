const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

require('./models/Exercise');
require('./models/Workout');

const workoutRoutes = require('./routes/workouts');
const exerciseRoutes = require('./routes/exercises');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.use('/api/workouts', workoutRoutes);
app.use('/api/exercises', exerciseRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});