import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/main.css";
import { useUserMode } from "../hooks/useUserMode";


function Navbar() {
  const { mode } = useUserMode();

  return (
    <nav className="navbar">
      <div className="navbar-brand">TuneRank</div>
      <ul className="navbar-links">
        <li>
          <Link to={`/${mode}`} className="nav-link">
            Home
          </Link>
        </li>
        <li>
          <Link to={`/${mode}/albums`} className="nav-link">
            Albums
          </Link>
        </li>
        <li>
          <Link to={`/${mode}/songs`} className="nav-link">
            Songs
          </Link>
        </li>
        <li>
          <Link to={`/${mode}/settings`} className="nav-link">
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
