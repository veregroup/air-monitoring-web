import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import MapView from './pages/MapView';
import History from './pages/History';

function App() {
  const location = useLocation();

  const getBackgroundColor = () => {
    switch (location.pathname) {
      case '/map':
        return '#e1b12c'; 
      case '/history':
        return '#3f51b5'; 
      default:
        return '#4B0082'; 
    }
  };

  return (
    <>
      <nav style={{ padding: 10, backgroundColor: getBackgroundColor(), transition: 'background-color 0.3s ease' }}>
        <Link to="/" style={{ margin: 10, color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/map" style={{ margin: 10, color: 'white', textDecoration: 'none' }}>Map</Link>
        <Link to="/history" style={{ margin: 10, color: 'white', textDecoration: 'none' }}>History</Link>
      </nav>

      <Routes>
        {/* Define your routes */}
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
