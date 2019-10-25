import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gameControl from "gamecontroller.js/src/gamecontrol";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { gql } from "apollo-boost";
import { buttonPressedAction } from "../actions/actions";
import { UPDATE_SCORE_MUTATION } from "../store/mutations";

export default function useRegisterGamePad() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { matchId, gameId, greenTeam } = useSelector(state => {
        return {
            matchId: state.app.matchId,
            gameId: state.app.gameId,
            greenTeam: state.game.greenTeam,
        };
    });
    const [updateScore, { loading: mutationRunning }] = useMutation(UPDATE_SCORE_MUTATION);
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
    useEffect(() => {
        gameControl.on("connect", function(gamepad) {
            const neededValues = {
                gamepad,
                dispatch,
                updateScore,
                nextGame,
                history,
            };
            registerButton({ id: "button0", color: "green", ...neededValues });
            registerButton({ id: "button3", color: "blue", ...neededValues });
        });
        return () => {
            gameControl.off("connect");
        };
    }, [matchId, gameId]);
}

function registerButton({ id, color, gamepad, dispatch, ...rest }) {
    let pressedOn = {};

    gamepad
        .before(id, () => {
            pressedOn = new Date();
        })
        .after(id, () => {
            const releasedOn = new Date();
            var dif = releasedOn.getTime() - pressedOn.getTime();

            dispatch(buttonPressedAction({ buttonColor: color, dif, ...rest }));
        });
}
