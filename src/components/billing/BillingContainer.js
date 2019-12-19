import React from "react";
import { Route, Link, Switch, useRouteMatch } from "react-router-dom";

import BillingForm from "./BillingForm";
import Billing from "./Billing.js";
import EditBilling from "./EditBilling";

export default function PaperContainer() {
  let { path, url } = useRouteMatch();

  return (
    <div className="container">
      <Link to={`${url}/addBilling`} className="btn btn-default m-1">
        Add Billing
      </Link>
      <Link to={`${url}`} className="btn btn-info m-1">
        VIew Billings
      </Link>
      <Switch>
        Billing
        <Route path={`${path}`} exact component={Billing} />
        <Route path={`${path}/addBilling`} component={BillingForm} />
        <Route path={`${path}/editBilling/:id`} component={EditBilling} />
      </Switch>
    </div>
  );
}
