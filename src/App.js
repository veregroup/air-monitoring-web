import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
