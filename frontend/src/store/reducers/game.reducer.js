import {
  CLEAR_GAME,
  INCREMENT,
  DECREMENT,
  INITIALIZE_GAME,
  INITIALIZE_MATCH,
  UPDATE_GAME,
  EXIT_GAME,
  DECLARE_WINNER
} from "../types";

export const initalGame = {};

export default function gameReducer(state = initalGame, action) {
  switch (action.type) {
    case INITIALIZE_MATCH:
      return { ...action.payload.game };
    case INITIALIZE_GAME:
      return { ...action.payload.game };
    case UPDATE_GAME:
      return action.payload || state;

    case EXIT_GAME:
      return {};
    // case INCREMENT:
    //   let switchServe = state.serveNum === 5;
    //   return {
    //     ...state,
    //     [action.team]: state[action.team] + 1,
    //     // serveNum: state.serveNum === 5 ? 1 : state.serveNum + 1,
    //     whoServes: switchServe
    //       ? state.whoServes === "team1"
    //         ? "team2"
    //         : "team1"
    //       : state.whoServes
    //   };
    // case DECREMENT:
    //   if (state[action.team] === 0) return state;
    //   return {
    //     ...state,
    //     [action.team]: state[action.team] - 1,
    //     serveNum: state.serveNum === 1 ? 5 : state.serveNum - 1,
    //     whoServes:
    //       state.serveNum !== 1
    //         ? state.whoServes
    //         : state.whoServes === "team1"
    //         ? "team2"
    //         : "team1"
    //   };

    default:
      return state;
  }
}
