import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { UPDATE_GAME } from "../store/types";
import { useDispatch, useSelector } from "react-redux";
import { gql } from "apollo-boost";
import { db } from "../store/firebaseConfig";

export default function useLiveGameDispatch(
  matchId,
  gameId,
  { dispatch: shouldDispatch } = { dispatch: true }
) {
  const dispatch = useDispatch();
  const [data, setData] = useState({ team1_score: 0, team2_score: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId || !gameId) return;
    const unsubscribe = db
      .doc(`matches/${matchId}/games/${gameId}`)
      .onSnapshot(ref => {
        setData(ref.data());
        if (shouldDispatch) {
          dispatch({ type: UPDATE_GAME, payload: ref.data() });
        }

        if (loading) setLoading(false);
      });
    return () => {
      unsubscribe();
    };
  }, [dispatch, gameId, loading, matchId, shouldDispatch]);

  return { data, loading };
}
