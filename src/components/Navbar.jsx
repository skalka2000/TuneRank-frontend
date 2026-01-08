import React from "react";
import { Link } from "react-router-dom";
import "../styles/main.css";

function Navbar() {
  return (
    <nav className="navbar" style={{ padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Album Rating</div>
      <ul style={{ listStyle: "none", display: "flex", gap: "1.5rem", margin: 0, padding: 0 }}>
        <li><Link to="/" className = "nav-link">Home</Link></li>
        <li><Link to="/albums" className = "nav-link">Albums</Link></li>
        <li><Link to="/songs" className = "nav-link">Songs</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
