import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import asyncComponent from "util/asyncComponent";

const Dashboard = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/general`} />
        <Route path={`${match.url}/general`} component={asyncComponent(() => import('./General/'))} />
        <Route path={`${match.url}/carteras`} component={asyncComponent(() => import('./Carteras/'))} />
    </Switch>
);

export default Dashboard;
