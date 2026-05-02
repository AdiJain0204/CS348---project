const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

require('./models/Exercise');
require('./models/Workout');

const workoutRoutes = require('./routes/workouts');
const exerciseRoutes = require('./routes/exercises');

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: ['https://cs-348-project-beta.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.use('/api/workouts', workoutRoutes);
app.use('/api/exercises', exerciseRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});