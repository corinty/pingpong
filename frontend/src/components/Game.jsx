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
import { loadPartialConfig } from "@babel/core";
import useRegisterGamePad from "../hooks/useRegisterGamePad";

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
  useRegisterGamePad();
  const { loading } = useSubscribeToGame();
  const history = useHistory();
  const dispatch = useDispatch();
  const matchState = useSelector(state => ({
    ...state.match,
    ...state.app,
    game: state.game
  }));

  const {
    team1_name,
    team2_name,
    serveNum,
    pointsToWin,
    game,
    matchId,
    gameId
  } = matchState;

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
