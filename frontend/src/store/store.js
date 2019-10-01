import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { getFirestore, reduxFirestore } from "redux-firestore";
import { reactReduxFirebase, getFirebase } from "react-redux-firebase";
import fbConfig from "./firebaseConfig";
import rootReducer from "./reducers/index.Reducer";

// Create store with reducers and initial state
const initialState = {};

const middleware = [thunk.withExtraArgument({ getFirebase, getFirestore })];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true }) || compose;
export default firebaseInstance => {
    return createStore(
        rootReducer,
        initialState,
        composeEnhancers(applyMiddleware(...middleware), reduxFirestore(firebaseInstance))
    );
};
