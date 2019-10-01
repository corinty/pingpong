import { INITIALIZE_MATCH, INITIALIZE_GAME, DECLARE_WINNER, EXIT_GAME } from "../types";

export const initializeMatchAction = ({ data, history }) => {
    return async dispatch => {
        dispatch({ type: INITIALIZE_MATCH, payload: data });

        history.push(`/match/${data.matchId}/game/${data.gameId}`, { ...data });
    };
};
export const initializeGameAction = ({ data, history }) => {
    return async dispatch => {
        // dispatch({ type: INITIALIZE_GAME, payload: { game: { ...data.game } } });

        history.push(`/match/${data.matchId}/game/${data.gameId}`, { ...data });
    };
};

export const buttonPressedAction = ({ buttonColor, dif, updateScore, nextGame, history }) => {
    return async (dispatch, getState) => {
        const { game, app, match } = getState();
        const isGreen = buttonColor === "green";
        const blueTeam = game.greenTeam === "team1" ? "team2" : "team1";
        if (!app.matchId || !app.gameId) {
            dispatch({ type: EXIT_GAME });
            history.push("/match");
        } else if (match.winner || match.matchOver) {
            dispatch({ type: EXIT_GAME });
            history.push("/match");
        } else if (game.winner) {
            nextGame().then(res => {
                dispatch(initializeGameAction({ data: res.data.nextGame, history }));
            });
        } else {
            dispatch({
                type: UPDATE_LOCAL_GAME,
                payload: {
                    team: isGreen ? game.greenTeam : blueTeam,
                    score: game[`${isGreen ? game.greenTeam : blueTeam}_score`],
                    increment: dif <= 450 ? true : false,
                },
            });
            updateScore({
                variables: {
                    team: isGreen ? game.greenTeam : blueTeam,
                    score: game[`${isGreen ? game.greenTeam : blueTeam}_score`],
                    increment: dif <= 450 ? true : false,
                    pointToWin: match.pointToWin,
                    matchId: app.matchId,
                    gameId: app.gameId,
                },
            });
        }
    };
};
