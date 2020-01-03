import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import asyncComponent from "util/asyncComponent";

// AGREGAMOS EL LOGIN PROVIDER PARA INICIAR SESION EN ESSALUD
import LoginProvider from "../../../providers/login_provider";

const Dashboard = ({ match }) => {
    // VALIDAMOS EL INICIO DE SESION Y HACEMOS UN LOOP CADA 5 MINUTOS
    LoginProvider.sesionExplota();
    console.log('SESION INICIADA');
    setInterval(() => {
        LoginProvider.sesionExplota();
        console.log('SESION ACTUALIZADA');
    }, 300000);

    return (
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/general`} />
            <Route path={`${match.url}/general`} component={asyncComponent(() => import('./General/'))} />
            <Route path={`${match.url}/carteras`} component={asyncComponent(() => import('./Carteras/'))} />
        </Switch>
    )
};

export default Dashboard;
