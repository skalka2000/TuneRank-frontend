import React from "react";
import { Link } from "react-router-dom";
import "../styles/main.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Album Rating</div>
      <ul className="navbar-links">
        <li><Link to="/" className = "nav-link">Home</Link></li>
        <li><Link to="/albums" className = "nav-link">Albums</Link></li>
        <li><Link to="/songs" className = "nav-link">Songs</Link></li>
        <li><Link to="/settings" className = "nav-link">Settings</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
