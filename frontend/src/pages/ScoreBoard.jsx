import React from "react";
import useLiveGame from "../hooks/useLiveGame";
import useLiveIds from "../hooks/useLiveIds";

export default function ScoreBoard() {
  const { matchId, gameId } = useLiveIds();

  const { loading: firebaseLoading, data: score } = useLiveGame(
    matchId,
    gameId,
    { dispatch: false }
  );

  return !firebaseLoading ? (
    <div className="scoreboard">
      <h1>Team 1: </h1>
      <h1>Team 2: </h1>
      <div className="scoreboard__score">{score?.team1_score}</div>
      <div className="scoreboard__score">{score?.team2_score}</div>
    </div>
  ) : (
    <p>Loading...</p>
  );
}
