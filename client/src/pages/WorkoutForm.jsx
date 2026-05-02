import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE = 'http://localhost:3001/api';

function WorkoutForm() {
  const [form, setForm] = useState({
    name: '',
    date: '',
    duration: '',
    notes: ''
  });
  const [exercises, setExercises] = useState([]);
  const [newExercise, setNewExercise] = useState({
    name: '',
    muscleGroup: '',
    sets: '',
    reps: '',
    weight: ''
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      axios.get(`${API_BASE}/workouts/${id}`)
        .then(res => {
          const w = res.data;
          setForm({
            name: w.name,
            date: w.date.split('T')[0],
            duration: w.duration,
            notes: w.notes || ''
          });
          setExercises(w.exercises || []);
        })
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleExerciseChange = (e) => {
    setNewExercise({ ...newExercise, [e.target.name]: e.target.value });
  };

  const addExercise = async () => {
    if (!newExercise.name || !newExercise.muscleGroup || !newExercise.sets || !newExercise.reps || !newExercise.weight) {
      alert('Please fill in all exercise fields');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/exercises`, newExercise);
      setExercises([...exercises, res.data]);
      setNewExercise({ name: '', muscleGroup: '', sets: '', reps: '', weight: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const workoutData = {
        ...form,
        exercises: exercises.map(ex => ex._id)
      };
      if (isEditing) {
        await axios.put(`${API_BASE}/workouts/${id}`, workoutData);
      } else {
        await axios.post(`${API_BASE}/workouts`, workoutData);
      }
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>{isEditing ? 'Edit Workout' : 'New Workout'}</h1>
      <form onSubmit={handleSubmit}>
        <label>Workout Name</label>
        <input style={inputStyle} name="name" value={form.name} onChange={handleChange} required />

        <label>Date</label>
        <input style={inputStyle} type="date" name="date" value={form.date} onChange={handleChange} required />

        <label>Duration (minutes)</label>
        <input style={inputStyle} type="number" name="duration" value={form.duration} onChange={handleChange} required />

        <label>Notes</label>
        <textarea style={{ ...inputStyle, height: '80px' }} name="notes" value={form.notes} onChange={handleChange} />

        {/* Exercises Section */}
        <h3>Exercises</h3>
        {exercises.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            {exercises.map((ex, index) => (
              <div key={index} style={{
                backgroundColor: '#f5f5f5',
                padding: '0.5rem 1rem',
                borderRadius: '5px',
                marginBottom: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{ex.name} — {ex.muscleGroup} — {ex.sets}x{ex.reps} @ {ex.weight}lbs</span>
                <button type="button" onClick={() => removeExercise(index)}
                  style={{ backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '5px', padding: '0.25rem 0.5rem', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>Add Exercise</h4>
          <input style={inputStyle} name="name" placeholder="Exercise name (e.g. Bench Press)" value={newExercise.name} onChange={handleExerciseChange} />
          <input style={inputStyle} name="muscleGroup" placeholder="Muscle group (e.g. Chest)" value={newExercise.muscleGroup} onChange={handleExerciseChange} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input style={{ ...inputStyle, flex: 1 }} type="number" name="sets" placeholder="Sets" value={newExercise.sets} onChange={handleExerciseChange} />
            <input style={{ ...inputStyle, flex: 1 }} type="number" name="reps" placeholder="Reps" value={newExercise.reps} onChange={handleExerciseChange} />
            <input style={{ ...inputStyle, flex: 1 }} type="number" name="weight" placeholder="Weight (lbs)" value={newExercise.weight} onChange={handleExerciseChange} />
          </div>
          <button type="button" onClick={addExercise}
            style={{ backgroundColor: '#1a1a2e', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' }}>
            + Add Exercise
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit"
            style={{ backgroundColor: '#e94560', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' }}>
            {isEditing ? 'Update Workout' : 'Add Workout'}
          </button>
          <button type="button" onClick={() => navigate('/')}
            style={{ backgroundColor: '#1a1a2e', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default WorkoutForm;