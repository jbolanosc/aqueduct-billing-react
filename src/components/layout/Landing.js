import React from "react";
import { Link } from "react-router-dom";

const Landing = () => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)"
    }}
    className=" jumbotron-fluid"
  >
    <div className="container">
      <h1 className="display-4">Asadas 2.0</h1>
      <p className="lead text-center">Welcome!</p>
      <p className="lead">
        <Link to="/clients" className="btn btn-outline-primary btn-lg">
            Go to Clients
        </Link>
        <Link to="/billing" className="btn btn-outline-primary btn-lg">
            Go to Billing
        </Link>
      </p>
    </div>
  </div>
);

export default Landing;
