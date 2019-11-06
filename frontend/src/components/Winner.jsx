import React, { useContext, useEffect } from "react";
import classnames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useHistory } from "react-router-dom";
import { initializeGameAction } from "..//actions/actions";
import { EXIT_GAME } from "../store/types";
import useSubscribeToGame from "../hooks/useSubscribeToGame";

export default function Winner() {
    const history = useHistory();
    const dispatch = useDispatch();

    const greenTeam = useSelector(state => state.game.greenTeam);
    const state = useSelector(state => ({
        team1: { name: state.match.team1_name, score: state.game.team1_score },
        team2: { name: state.match.team2_name, score: state.game.team2_score },
        match: state.match,
        greenTeam: state.game.greenTeam,
        isMatchOver: state.match.winner !== null,
        matchWinner: state.match.winner,
        gameWinner: state.game.winner,
        app: state.app,
    }));

    const {
        app: { matchId, gameId },
        match,
        isMatchOver,
        gameWinner,
        matchWinner,
    } = state;

    const [nextGame, { loading: mutationLoading }] = useMutation(
        gql`
            mutation NextGame($matchId: String!, $prevGreenTeam: TeamEnum!) {
                nextGame(matchId: $matchId, prevGreenTeam: $prevGreenTeam) {
                    matchId
                    gameId
                    game {
                        team1_score
                        team2_score
                        servingTeam
                    }
                }
            }
        `,
        { variables: { matchId, prevGreenTeam: greenTeam } }
    );
    const greenOrBlue = isMatchOver
        ? matchWinner === greenTeam
            ? "green"
            : gameWinner === greenTeam
            ? "green"
            : "blue"
        : "blue";

    useEffect(() => {
        document.addEventListener("keydown", addArcadeListeners);
        function addArcadeListeners(e) {
            if (e.key === "w" || "q" || "a" || "s") {
                nextGame().then(res => {
                    dispatch(initializeGameAction({ data: res.data.nextGame, history }));
                });
            }
        }

        return () => {
            document.removeEventListener("keydown", addArcadeListeners);
        };
    }, [dispatch, history, nextGame]);

    if (isMatchOver) {
        setTimeout(() => {
            dispatch({ type: EXIT_GAME });
            history.push("/match");
        }, 10000);
    }
    if (!gameWinner) {
        return (
            <>
                <p>Unknown Error</p>
                <button onClick={() => history.push("/match")}>New Match Screen</button>
            </>
        );
    }

    return (
        <div className={classnames("winner-screen pi-focused", greenOrBlue)}>
            <p>
                {isMatchOver
                    ? `${state[matchWinner].name} wins the match!`
                    : `${state[gameWinner].name} wins the game!`}
            </p>
            <button
                className="btn--full-width"
                onClick={() => {
                    if (isMatchOver || match.matchOver) {
                        dispatch({ type: EXIT_GAME });
                        history.push("/match");
                    } else {
                        nextGame().then(res => {
                            dispatch(initializeGameAction({ data: res.data.nextGame, history }));
                        });
                    }
                }}>
                {isMatchOver || match.matchOver
                    ? "New Match"
                    : !mutationLoading
                    ? "Next Game"
                    : "Loading..."}
            </button>
        </div>
    );
}
