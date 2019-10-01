import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { UPDATE_GAME, UPDATE_MATCH } from "../store/types";
import { useDispatch, useSelector } from "react-redux";
import { gql } from "apollo-boost";
import { db } from "../store/firebaseConfig";
import { ACTIVE_MATCH_QUERY } from "../store/queries";
import { declareWinnerAction } from "../store/actions/actions";

import useLiveIds from "./useLiveIds";

export default function useSubscribeToGame(navigateAway = true) {
    const dispatch = useDispatch();
    const [isTableOpen, setTableOpen] = useState(true);
    const { matchId, gameId, loading } = useLiveIds();

    const [game, setGame] = useState({
        team1_score: 0,
        team2_score: 0,
    });

    // Listen to the score of the live game
    useEffect(() => {
        if (loading) return;

        setTableOpen(!matchId || !gameId ? true : false);

        const unsubscribeGame = db.doc(`matches/${matchId}/games/${gameId}`).onSnapshot(ref => {
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
    return { loading, isTableOpen };
}
