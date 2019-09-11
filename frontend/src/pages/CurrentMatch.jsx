/* eslint-disable*/
import React, { useEffect } from "react";
import { __RouterContext } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@apollo/react-hooks";
import { db } from "../store/firebaseConfig";
import { UPDATE_MATCH } from "../store/types";
import Game from "../components/Game";
import Winner from "../components/Winner";
import { ACTIVE_MATCH_QUERY } from "../store/queries";

function CurrentMatch({ history, match: { params } }) {
  const matchInit = useSelector(state => state.app.matchInit);
  const dispatch = useDispatch();

  const { data, loading } = useQuery(ACTIVE_MATCH_QUERY, {
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    if (loading) return;
    dispatch({ type: UPDATE_MATCH, payload: data.activeMatch?.match });
  }, [data]);

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
