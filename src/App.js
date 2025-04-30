import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import Home from './pages/Home';
import MapView from './pages/MapView';
import History from './pages/History';

function App() {
  return (
    <Router>
      <nav style={{ padding: 10 }}>
        <Link to="/" style={{ margin: 10 }}>Home</Link>
        <Link to="/map" style={{ margin: 10 }}>Map</Link>
        <Link to="/history" style={{ margin: 10 }}>History</Link>
      </nav>
      <Routes>
      <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/history" element={<History />} />
        {/* Fallback route for unmatched paths */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
