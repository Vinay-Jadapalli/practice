import React from "react";

import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <a href="/" className="logo">
          React CRUD App
        </a>
      </div>
    </header>
  );
};

export default Header;
