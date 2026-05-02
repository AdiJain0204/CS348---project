import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{
      backgroundColor: '#1a1a2e',
      padding: '1rem 2rem',
      display: 'flex',
      gap: '2rem',
      alignItems: 'center'
    }}>
      <h2 style={{ color: 'white', margin: 0 }}>🏋️ Gym Tracker</h2>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Workouts</Link>
      <Link to="/report" style={{ color: 'white', textDecoration: 'none' }}>Report</Link>
    </nav>
  );
}

export default Navbar;