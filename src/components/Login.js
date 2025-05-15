import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import bgImage from "../assets/AhonPalanan.png"; // ✅ IMPORT image

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "1234") {
      localStorage.setItem("isLoggedIn", "true");
      alert("Login successful!");
      navigate("/home");
    } else {
      alert("Invalid credentials");
    }
  };

  const backgroundStyle = {
    backgroundImage: `url(${bgImage})`, // ✅ use imported image
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div style={backgroundStyle}>
      <div className="login-container">
        <h2>Air Monitoring Login</h2>
        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
