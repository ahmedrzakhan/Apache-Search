import React from "react";
import { Switch, Route } from "react-router-dom";
import Register from "./../components/form/Register";
import Login from "./../components/form/Login";
import Dashboard from "./../components/dashboard/Dashboard";

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" render={(props) => <Login {...props} />} />
      <Route path="/register" render={(props) => <Register {...props} />} />
      <Route path="/dashboard" render={(props) => <Dashboard {...props} />} />
    </Switch>
  );
};

export default Routes;
