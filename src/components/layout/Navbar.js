import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => (
    <nav className="navbar navbar-expand-lg navbar-dark bg-info">
      <Link to="/" className="navbar-brand">
        Asadas 2.0
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <Link to="/clients" className="nav-item nav-link" >Clients</Link>
          <Link to="/billing" className="nav-item nav-link" >Billing</Link>
          <Link to="/general" className="nav-item nav-link" >General Data</Link>
        </div>
      </div>
    </nav>
);

export default NavBar;
