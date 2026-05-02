import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function WorkoutList() {
  const [workouts, setWorkouts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/workouts');
      setWorkouts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteWorkout = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await axios.delete(`http://localhost:3001/api/workouts/${id}`);
        fetchWorkouts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Workouts</h1>
        <button
          onClick={() => navigate('/workout/new')}
          style={{
            backgroundColor: '#e94560',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
          + New Workout
        </button>
      </div>

      {workouts.length === 0 ? (
        <p>No workouts yet. Add one!</p>
      ) : (
        workouts.map(workout => (
          <div key={workout._id} style={{
            backgroundColor: '#f5f5f5',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ margin: 0 }}>{workout.name}</h3>
              <p style={{ margin: '0.25rem 0', color: '#666' }}>
                {new Date(workout.date).toLocaleDateString()} — {workout.duration} mins
              </p>
              {workout.notes && <p style={{ margin: 0, color: '#888' }}>{workout.notes}</p>}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => navigate(`/workout/edit/${workout._id}`)}
                style={{
                  backgroundColor: '#1a1a2e',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}>
                Edit
              </button>
              <button
                onClick={() => deleteWorkout(workout._id)}
                style={{
                  backgroundColor: '#e94560',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default WorkoutList;