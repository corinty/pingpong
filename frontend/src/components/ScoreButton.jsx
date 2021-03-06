import React, { useContext, useState, useEffect } from "react";
import { __RouterContext } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_SCORE_MUTATION } from "../store/mutations";
import { UPDATE_LOCAL_GAME } from "../store/types";

const ScoreButton = ({ side }) => {
    const dispatch = useDispatch();
    const { greenTeam, matchId, gameId } = useSelector(state => ({
        greenTeam: state.game.greenTeam,
        matchId: state.app.matchId,
        gameId: state.app.gameId,
    }));

    const [updateScore, { loading: mutationRunning }] = useMutation(UPDATE_SCORE_MUTATION, {
        variables: { matchId, gameId },
    });
    const [isDisabled, setDisabled] = useState(false);
    const [justScored, setJustScored] = useState(false);
    const team = side === "green" ? greenTeam : greenTeam === "team1" ? "team2" : "team1";
    const teamInfo = useSelector(state => {
        return {
            name: state.match[`${team}_name`],
            score: state.game[`${team}_score`],
        };
    });
    const { name, score } = teamInfo;
    useEffect(() => {
        if (teamInfo.score === 0 || teamInfo.score === undefined) return;
        setJustScored(true);
        setTimeout(() => {
            setJustScored(false);
        }, 650);
    }, [teamInfo.score]);

    return (
        <button
            className={"btn--increment " + side + `${justScored ? " scored" : ""}`}
            disabled={mutationRunning && isDisabled}
            onClick={() => {
                setDisabled(true);
                dispatch({ type: UPDATE_LOCAL_GAME, payload: { team, increment: true } });
                updateScore({
                    variables: {
                        team,
                        increment: true,
                    },
                }).then(res => {
                    setDisabled(false);
                });
            }}>
            <p className="team-name">{name && name.length > 0 ? name : team}</p>
            <p className="score">{score}</p>
        </button>
    );
};

export default ScoreButton;
