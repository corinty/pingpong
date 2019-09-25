import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { UPDATE_MATCH, UPDATE_GAME, DECLARE_WINNER } from "../store/types";
import { DECLARE_WINNER_MUTAION } from "../store/mutations";
import { declareWinnerAction } from "../store/actions/actions";

export default function useCheckForWinner({ team1_score, team2_score }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [winner, setWinner] = useState(null);

  const { data, loading: loadingQuery } = useQuery(
    gql`
      query getActiveMatch {
        activeMatch {
          matchId
          gameId
          match {
            winner
            pointsToWin
          }
        }
      }
    `,
    { fetchPolicy: "network-only" }
  );

  /**
   * Logic to check if there should be a game winner
   */
  useEffect(() => {
    const score = {
      team1: team1_score,
      team2: team2_score
    };

    if (loadingQuery) return;
    const {
      match: { pointsToWin, winner }
    } = data.activeMatch;

    const checkForWinner = Object.entries(score).find(
      ([team, score]) => score >= pointsToWin
    );

    if (checkForWinner && Math.abs(team1_score - team2_score) > 1) {
      const results = Object.entries(score).sort((a, b) => {
        return a[1] < b[1] ? 1 : -1;
      })[0];
      const winnerObj = {
        finalScore: { team1_score, team2_score },
        winningTeam: results[0]
      };

      setWinner(winnerObj);
    }
  }, [data, loadingQuery, team1_score, team2_score]);

  /**
   * Declare winner mutation
   */ const [declareWinner, { data: mutationData, error }] = useMutation(
    DECLARE_WINNER_MUTAION
  );
  useEffect(() => {
    if (!winner || loadingQuery) return;
    declareWinner({
      variables: {
        matchId: data.activeMatch.matchId,
        gameId: data.activeMatch.gameId,
        winner: winner.winningTeam
      }
    }).then(({ data: { declareWinner } }) => {
      dispatch({ type: DECLARE_WINNER });
      history.push("/match/winner", {
        match: {
          ...declareWinner
        }
      });
    });
  }, [data, declareWinner, dispatch, loadingQuery, winner]);

  return winner;
}
