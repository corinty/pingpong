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

    default:
      return state;
  }
}
