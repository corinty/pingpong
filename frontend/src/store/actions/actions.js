import { INITIALIZE_MATCH, INITIALIZE_GAME } from "../types";

export const initializeMatchAction = ({ data, history }) => {
  return async dispatch => {
    dispatch({ type: INITIALIZE_MATCH, payload: data });

    history.push(`/match/${data.matchId}/game/${data.gameId}`, { ...data });
  };
};
export const initializeGameAction = ({ data, history }) => {
  return async dispatch => {
    dispatch({ type: INITIALIZE_GAME, payload: data.game });

    history.push(`/match/${data.matchId}/game/${data.gameId}`, { ...data });
  };
};
