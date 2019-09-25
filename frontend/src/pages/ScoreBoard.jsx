import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { ACTIVE_MATCH_QUERY } from "../store/queries";
import useSubscribeToGame from "../hooks/useSubscribeToGame";
import useLiveIds from "../hooks/useLiveIds";

export default function ScoreBoard() {
  const { matchId, gameId } = useLiveIds();
  const { data, loading, refetch: refetchNames } = useQuery(
    gql`
      query getActiveMatch {
        activeMatch {
          match {
            team1_name
            team2_name
          }
        }
      }
    `,
    {
      fetchPolicy: "network-only"
    }
  );

  const { loading: firebaseLoading, data: game } = useSubscribeToGame(
    matchId,
    gameId,
    { dispatch: false }
  );
  const { greenTeam } = game;

  useEffect(() => {
    refetchNames();
  }, [matchId]);

  return !firebaseLoading && !loading ? (
    <div className="scoreboard">
      <TeamScore
        score={game[`${greenTeam}_score`]}
        team={data.activeMatch?.match[`${greenTeam}_name`]}
      />
      <TeamScore
        score={game[`${greenTeam === "team1" ? "team2" : "team1"}_score`]}
        team={
          data.activeMatch?.match[
            `${greenTeam === "team1" ? "team2" : "team1"}_name`
          ]
        }
      />
    </div>
  ) : (
    <p>Loading...</p>
  );
}

function TeamScore({ score, team }) {
  return (
    <div className="team-score">
      <h1>{team}:</h1>
      <div className="scoreboard__score">{score}</div>
    </div>
  );
}
