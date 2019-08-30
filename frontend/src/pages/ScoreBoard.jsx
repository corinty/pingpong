import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_ACTIVE_MATCH } from "../store/queries";
import { db } from "../store/firebaseConfig";

export default function ScoreBoard() {
  const { loading, error, data } = useQuery(GET_ACTIVE_MATCH);
  const { matchData } = data?.activeMatch;
  return !loading ? (
    <div className="scoreboard">
      <div>Team 1</div>
      <div>team 2</div>
    </div>
  ) : (
    <p>Loading...</p>
  );
}
