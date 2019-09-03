import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import createReduxStore from "./store/store";
import firebase from "firebase/app";

// Add the Firebase services that you want to use
import { Provider } from "react-redux";
import CurrentMatch from "./pages/CurrentMatch";
import NewMatch from "./pages/NewMatch";
import ScoreBoard from "./pages/ScoreBoard";
import "./scss/App.scss";

const store = createReduxStore(firebase);

const client = new ApolloClient();

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Router>
            <Switch>
              {/* Pi Focused screens  */}

              <Route path="/match" exact component={NewMatch} />
              <Route
                path={["/match/:matchId/game/:gameId"]}
                component={CurrentMatch}
              />
              <Route path="/scoreboard" component={ScoreBoard} />
            </Switch>
          </Router>
        </Provider>
      </ApolloProvider>
    );
  }
}
