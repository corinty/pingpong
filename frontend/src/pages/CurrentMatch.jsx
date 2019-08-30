/* eslint-disable*/
import React, { useEffect } from "react";
import { __RouterContext } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { db } from "../store/firebaseConfig";
import { UPDATE_MATCH } from "../store/types";
import Game from "../components/Game";
import Winner from "../components/Winner";

function CurrentMatch({ history, match: { params } }) {
  const winner = useSelector(state => ({
    game: state.game.winner,
    match: state.match.winner
  }));

  return winner.game || winner.match ? (
    <Winner winner={winner} matchId={params.matchId} />
  ) : (
    <Game />
  );
}

export default CurrentMatch;
