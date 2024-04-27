import React from "react";
import "./styles.css"; // Adjust the import path if necessary

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <p className="copyright">&copy; {currentYear} Your Company or Name</p>
      <nav className="footer-links">
        <button className="footer-link">About Us</button>
        <button className="footer-link">Contact</button>
        <button className="footer-link">Privacy Policy</button>
      </nav>
    </footer>
  );
};

export default Footer;
