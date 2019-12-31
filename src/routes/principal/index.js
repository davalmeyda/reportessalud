import React from "react";
import {Route, Switch} from "react-router-dom";

import asyncComponent from "util/asyncComponent";

const Principal = ({match}) => (
  <Switch>    
    <Route path={`${match.url}/dashboard`} component={asyncComponent(() => import('./Dashboard/'))}/>
  </Switch>
);

export default Principal;