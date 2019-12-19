import React from "react";
import { Route, Link, Switch, useRouteMatch } from "react-router-dom";

import ClientForm from "./ClientForm";
import Clients from "./Clients";
import EditClient from "./EditClient";

export default function CLientContainer() {
  let { path, url } = useRouteMatch();

  return (
    <div className="container">
      <Link to={`${url}/addClient`} className="btn btn-outline-info m-1">
        Add client
      </Link>
      <Link to={`${url}`} className="btn btn-info m-1">
        View clients
      </Link>
      <Switch>
        <Route path={`${path}`} exact component={Clients} />
        <Route path={`${path}/addClient`} component={ClientForm} />
        <Route path={`${path}/editClient/:id`} component={EditClient} />
      </Switch>
    </div>
  );
}
