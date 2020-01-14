import React from "react";
import { Route, Switch } from "react-router-dom";

import { ConfigProvider } from 'antd';
import esES from 'antd/es/locale/es_ES';

import Principal from "./principal/index";

const App = ({ match }) => (
  <div className="gx-main-content-wrapper">
    <Switch>
      <ConfigProvider locale={esES}>
        <Route path={`${match.url}principal`} component={Principal} />
      </ConfigProvider>
    </Switch>
  </div>
);

export default App;
