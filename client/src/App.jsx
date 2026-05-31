import { Routes, Route } from 'react-router-dom';
import Landing from './routes/Landing';
import Auth from './routes/Auth';
import Dashboard from './routes/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-surface text-white bg-[radial-gradient(circle_at_top_left,_rgba(138,57,255,0.2),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(34,255,180,0.12),_transparent_18%)]">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
