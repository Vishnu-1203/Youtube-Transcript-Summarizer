import React from "react";
import "./styles.css"; // Adjust the import path if necessary

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <p className="copyright summary-heading averia-serif-libre-regular">
        {" "}
        {currentYear} All rights reserved <br />
        Vishnudath M
      </p>
    </footer>
  );
};

export default Footer;
