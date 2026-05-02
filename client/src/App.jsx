import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import WorkoutList from './pages/WorkoutList';
import WorkoutForm from './pages/WorkoutForm';
import Report from './pages/Report';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<WorkoutList />} />
        <Route path="/workout/new" element={<WorkoutForm />} />
        <Route path="/workout/edit/:id" element={<WorkoutForm />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;