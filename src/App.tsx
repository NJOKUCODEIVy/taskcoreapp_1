import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Pomodoro from './pages/Pomodoro';
import MoodTracker from './pages/MoodTracker';
import StudyTimeGenerator from './pages/StudyTimeGenerator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/mood" element={<MoodTracker />} />
        <Route path="/study-time" element={<StudyTimeGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;

