import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import ScoreTracker from "./ScoreTracker";
import NewGame from "./NewGame";
import "./App.css";

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={NewGame} />
          <Route path="/active-game" component={ScoreTracker} />
        </Switch>
      </Router>
    );
  }
}
