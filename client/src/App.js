import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./index.css";
import Home from "./Home/Home";
import Explorer from "./Explorer/Explorer";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/explorer" component={Explorer} />
      </Switch>
    </Router>
  );
}

export default App;
