import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'https://adi-gym-tracker-backend.onrender.com/api';

function Report() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  // Fetch muscle groups from database dynamically
  useEffect(() => {
    axios.get(`${API_BASE}/exercises/muscle-groups`)
      .then(res => setMuscleGroups(res.data))
      .catch(err => console.error(err));
  }, []);

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      setError('Please select both a start and end date.');
      return;
    }
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/workouts/report/stats`, {
        params: { startDate, endDate, muscleGroup: selectedMuscleGroup }
      });
      setReport(res.data);
    } catch (err) {
      console.error(err);
      setError('Error fetching report.');
    }
  };

  const inputStyle = {
    padding: '0.5rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem'
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Workout Report</h1>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <label>Start Date</label><br />
          <input style={inputStyle} type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div>
          <label>End Date</label><br />
          <input style={inputStyle} type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <div>
          <label>Muscle Group</label><br />
          <select
            style={inputStyle}
            value={selectedMuscleGroup}
            onChange={e => setSelectedMuscleGroup(e.target.value)}
          >
            <option value="">All Muscle Groups</option>
            {muscleGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>
        <button
          onClick={fetchReport}
          style={{
            backgroundColor: '#e94560',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1.5rem',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
          Generate Report
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {muscleGroups.length > 0 && (
        <p style={{ color: '#888', fontSize: '0.9rem' }}>
          Muscle groups loaded from database: {muscleGroups.join(', ')}
        </p>
      )}

      {report && (
        <div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: '#1a1a2e', color: 'white', padding: '1rem 2rem', borderRadius: '8px', textAlign: 'center' }}>
              <h2 style={{ margin: 0 }}>{report.totalWorkouts}</h2>
              <p style={{ margin: 0 }}>Total Workouts</p>
            </div>
            <div style={{ backgroundColor: '#e94560', color: 'white', padding: '1rem 2rem', borderRadius: '8px', textAlign: 'center' }}>
              <h2 style={{ margin: 0 }}>{report.avgDuration.toFixed(1)}</h2>
              <p style={{ margin: 0 }}>Avg Duration (mins)</p>
            </div>
          </div>

          {report.workouts.length === 0 ? (
            <p>No workouts found in this date range.</p>
          ) : (
            report.workouts.map(workout => (
              <div key={workout._id} style={{
                backgroundColor: '#f5f5f5',
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '8px'
              }}>
                <h3 style={{ margin: 0 }}>{workout.name}</h3>
                <p style={{ margin: '0.25rem 0', color: '#666' }}>
                  {new Date(workout.date).toLocaleDateString()} — {workout.duration} mins
                </p>
                {workout.notes && <p style={{ margin: '0.25rem 0', color: '#888' }}>{workout.notes}</p>}
                {workout.exercises && workout.exercises.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong>Exercises:</strong>
                    {workout.exercises.map((ex, i) => (
                      <p key={i} style={{ margin: '0.25rem 0', color: '#555' }}>
                        {ex.name} — {ex.muscleGroup} — {ex.sets}x{ex.reps} @ {ex.weight}lbs
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Report;