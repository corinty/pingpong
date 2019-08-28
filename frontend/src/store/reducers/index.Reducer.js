import { combineReducers } from "redux";
import { APP_ERROR, INITIALIZE_MATCH, EXIT_GAME } from "../types";
import matchReducer from "./match.reducer";
import gameReducer from "./game.reducer";

export const initialAppState = {
  error: false,
  errorMessage: "",
  matchInit: false
};

function app(state = initialAppState, { type, error, payload }) {
  switch (type) {
    case INITIALIZE_MATCH:
      return {
        ...state,
        matchId: payload.matchId,
        gameId: payload.gameId,
        matchInit: true
      };
    case APP_ERROR:
      return { ...state, error: true, errorMessage: error };
    case EXIT_GAME:
      return { ...initialAppState, matchInit: false };
    default:
      return state;
  }
}

export const rootReducer = combineReducers({
  match: matchReducer,
  game: gameReducer,
  app
});
export default rootReducer;
