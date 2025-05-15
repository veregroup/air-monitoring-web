// App.js
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "./components/Login";
import Home from "./pages/Home";
import MapView from "./pages/MapView";
import History from "./pages/History";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ Move routing + logic inside a router-aware component
const MainApp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const getBackgroundColor = () => {
    switch (location.pathname) {
      case "/map":
        return "#e1b12c";
      case "/history":
        return "#3f51b5";
      default:
        return "#4B0082";
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("isLoggedIn");
      navigate("/login"); // ✅ Navigate safely using React Router
    }
  };

  return (
    <>
      {/* Navbar shown only when logged in and not on login page */}
      {isLoggedIn && location.pathname !== "/login" && (
        <nav
          style={{
            padding: 10,
            backgroundColor: getBackgroundColor(),
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            transition: "background-color 0.3s ease",
          }}
        >
          <div>
            <Link to="/home" style={{ margin: 10, color: "white", textDecoration: "none" }}>
              Home
            </Link>
            <Link to="/map" style={{ margin: 10, color: "white", textDecoration: "none" }}>
              Map
            </Link>
            <Link to="/history" style={{ margin: 10, color: "white", textDecoration: "none" }}>
              History
            </Link>
          </div>
          <button
            onClick={handleLogout}
            style={{
              marginRight: 10,
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Navigate to={isLoggedIn ? "/home" : "/login"} replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <MapView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

// ✅ Wrap with Router properly
export default function WrappedApp() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}