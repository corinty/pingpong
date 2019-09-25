import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { UPDATE_GAME, UPDATE_MATCH } from "../store/types";
import { useDispatch, useSelector } from "react-redux";
import { gql } from "apollo-boost";
import { db } from "../store/firebaseConfig";
import { ACTIVE_MATCH_QUERY } from "../store/queries";
import { declareWinnerAction } from "../store/actions/actions";
import useCheckForWinner from "./useCheckForWinner";
import useLiveIds from "./useLiveIds";

export default function useSubscribeToGame() {
  const dispatch = useDispatch();

  const { matchId, gameId, loading } = useLiveIds();

  const [game, setGame] = useState({
    team1_score: 0,
    team2_score: 0
  });

  // Listen to the score of the live game
  useEffect(() => {
    if (loading) return;

    const unsubscribeGame = db
      .doc(`matches/${matchId}/games/${gameId}`)
      .onSnapshot(ref => {
        setGame(ref.data());
        dispatch({ type: UPDATE_GAME, payload: ref.data() });
      });
    const unsubscribeMatch = db.doc(`matches/${matchId}`).onSnapshot(ref => {
      dispatch({ type: UPDATE_MATCH, payload: ref.data() });
    });

    return () => {
      unsubscribeGame();
      unsubscribeMatch();
    };
  }, [matchId, gameId, loading]);

  // Declare winner
  useCheckForWinner({
    team1_score: game.team1_score,
    team2_score: game.team2_score
  });
  return { loading };
}
