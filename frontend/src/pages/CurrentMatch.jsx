/* eslint-disable*/
import React, { useEffect } from "react";
import { __RouterContext, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@apollo/react-hooks";
import { db } from "../store/firebaseConfig";
import { UPDATE_MATCH } from "../store/types";
import Game from "../components/Game";
import Winner from "../components/Winner";
import { ACTIVE_MATCH_QUERY } from "../store/queries";

function CurrentMatch({ history, match: { params } }) {
  const matchInit = useSelector(state => state.app.matchInit);
  const matchId = useSelector(state => state.app.matchId);
  const dispatch = useDispatch();

  const { data, loading } = useQuery(ACTIVE_MATCH_QUERY, {
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    if (loading || matchInit) return;
    dispatch({ type: UPDATE_MATCH, payload: data.activeMatch?.match });
  }, [data]);

  return !matchId ? <Redirect to="/match" /> : <Game />;
}

export default CurrentMatch;
