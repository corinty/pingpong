import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import createReduxStore from "./store/store";
import firebase from "firebase/app";

// Add the Firebase services that you want to use
import { Provider } from "react-redux";
import CurrentMatch from "./pages/CurrentMatch";
import NewMatch from "./pages/NewMatch";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Winner from "./components/Winner";
import ScorePage from "./pages/ScorePage";
import "./scss/App.scss";

import LogRocket from "logrocket";
LogRocket.init("mgellb/ping-pong");

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
                            <Route path={"/"} exact component={LandingPage} />
                            <Route path={"/match"} exact component={NewMatch} />
                            <Route
                                path={["/match/:matchId/game/:gameId"]}
                                component={CurrentMatch}
                            />
                            <Route path="/scoreboard" component={ScorePage} />
                            <Route path="/dashbaord" component={Dashboard} />
                            <Route path="/match/winner" component={Winner} />
                        </Switch>
                    </Router>
                </Provider>
            </ApolloProvider>
        );
    }
}
