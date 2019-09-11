import React, { useContext, useState } from "react";
import { __RouterContext } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_SCORE_MUTATION } from "../store/mutations";

const ScoreButton = ({ side }) => {
  const {
    history,
    match: {
      params: { matchId, gameId }
    }
  } = useContext(__RouterContext);
  const [updateScore, { loading: mutationRunning }] = useMutation(
    UPDATE_SCORE_MUTATION,
    { variables: { matchId, gameId } }
  );
  const [isDisabled, setDisabled] = useState(false);
  const greenTeam = useSelector(state => state.game.greenTeam);
  const team =
    side === "green" ? greenTeam : greenTeam === "team1" ? "team2" : "team1";
  const teamInfo = useSelector(state => {
    return {
      name: state.match[`${team}_name`],
      score: state.game[`${team}_score`]
    };
  });
  const { name, score } = teamInfo;

  return (
    <button
      className={"btn--increment " + side}
      disabled={mutationRunning && isDisabled}
      onClick={() => {
        setDisabled(true);
        updateScore({
          variables: {
            team,
            score,
            increment: true
          }
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
