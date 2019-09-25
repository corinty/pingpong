import React, { useContext, useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";

import { gql } from "apollo-boost";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { SWAP_SERVE, CLEAR_GAME, EXIT_GAME } from "../store/types";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_SCORE_MUTATION } from "../store/mutations";
import useSubscribeToGame from "../hooks/useSubscribeToGame";
import useCheckForWinner from "../hooks/useCheckForWinner";

import ScoreButton from "./ScoreButton";

const Container = styled.div`
  display: grid;
  height: 100%;
  position: relative;
  grid-template-columns: 1fr 50px 1fr;
`;

export default function Game() {
  /**
   * Component data
   */
  const { loading } = useSubscribeToGame();
  const history = useHistory();

  const dispatch = useDispatch();
  const matchState = useSelector(state => ({
    ...state.match,
    ...state.app,
    game: state.game
  }));
  const [updatingScore, setUpdatingScore] = useState({
    team1: false,
    team2: false
  });

  const {
    team1_name,
    team2_name,
    serveNum,
    pointsToWin,
    game,
    matchId,
    gameId
  } = matchState;

  const [updateScore, { loading: mutationRunning }] = useMutation(
    UPDATE_SCORE_MUTATION,
    { variables: { matchId, gameId } }
  );

  useEffect(() => {
    document.addEventListener("keydown", addArcadeListeners);
    function addArcadeListeners(e) {
      const blueTeam = game.greenTeam === "team1" ? "team2" : "team1";

      switch (e.key) {
        case "q":
          updateScore({
            variables: {
              team: game.greenTeam,
              score: game[`${game.greenTeam}_score`],
              increment: true
            }
          });
          break;
        case "a":
          updateScore({
            variables: {
              team: game.greenTeam,
              score: game[`${game.greenTeam}_score`],
              increment: false
            }
          });
          break;
        case "w":
          updateScore({
            variables: {
              team: blueTeam,
              score: game[`${blueTeam}_score`],
              increment: true
            }
          });
          break;
        case "s":
          updateScore({
            variables: {
              team: blueTeam,
              score: game[`${blueTeam}_score`],
              increment: false
            }
          });
          break;
        default:
      }
    }
    return () => {
      document.removeEventListener("keydown", addArcadeListeners);
    };
  }, [dispatch, updateScore, game]);

  // return <p>back to data testing</p>;

  return loading ? null : (
    <Container className="pi-focused">
      <ScoreButton side="green" />

      <div
        className="center-btns"
        onClick={() => {
          dispatch({ type: EXIT_GAME });
          history.push("/match");
        }}
      />

      <ScoreButton side="blue" />
    </Container>
  );
}
