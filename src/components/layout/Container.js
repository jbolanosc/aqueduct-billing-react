import React from "react";
import { Route } from "react-router-dom";

import ClientContainer from "../clients/ClientContainer";
import BillingContainer from "../billing/BillingContainer";
import General from "../general/General";
import Landing from "./Landing";


const MainContainer = () => (
  <div className="container-fluid h-100 w-100 p-0">
      <Route path="/" exact component={Landing} />
      <Route path="/general" component={General} />
      <Route path="/clients" component={ClientContainer} />
      <Route path="/billing" component={BillingContainer} />
  </div>
);

export default MainContainer;