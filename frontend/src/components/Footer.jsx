import React from "react";
import { NavLink } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>
          &copy; {new Date().getFullYear()} All rights reserved. || NBanana AI.
        </p>
        <div className="footer-links">
             <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
        </div>
        <p>
          Made with <span style={{ color: "#7655e2ff" }}>❤</span> by Pradnesh
          Patil.
        </p>
      </div>
    </footer>
  );
};
