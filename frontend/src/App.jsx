import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import createReduxStore from "./store/store";
import firebase from "firebase/app";

// Add the Firebase services that you want to use
import { Provider } from "react-redux";
import CurrentMatch from "./CurrentMatch";
import NewMatch from "./NewMatch";
import "./App.scss";

const store = createReduxStore(firebase);

const client = new ApolloClient();

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Router>
            <Switch>
              <Route path="/" exact component={NewMatch} />

              <Route
                path={["/match/:matchId/game/:gameId"]}
                component={CurrentMatch}
              />
            </Switch>
          </Router>
        </Provider>
      </ApolloProvider>
    );
  }
}
