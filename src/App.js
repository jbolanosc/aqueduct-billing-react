import React, { Fragment } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import NavBar from "./components/layout/Navbar";
import MainContainer from "./components/layout/Container";

function App() {
  return (
    <Router>
      <Switch>
        <Fragment>
          <div className="container-fluid w-100">
                <NavBar />
                <MainContainer />
          </div>
        </Fragment>
      </Switch>
    </Router>
  );
}

export default App;
