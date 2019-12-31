import React from "react";
import {Route, Switch} from "react-router-dom";

import Principal from "./principal/index";

const App = ({match}) => (
  <div className="gx-main-content-wrapper">
    <Switch>     
      <Route path={`${match.url}principal`} component={Principal}/>
    </Switch>
  </div>
);

export default App;
