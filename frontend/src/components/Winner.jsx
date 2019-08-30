import React, { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { __RouterContext } from "react-router-dom";
import { initializeGameAction } from "../store/actions/actions";
import { EXIT_GAME } from "../store/types";

export default function Winner({ winner, matchId }) {
  const { history } = useContext(__RouterContext);
  const dispatch = useDispatch();
  const [nextGame, { loading: mutationLoading }] = useMutation(
    gql`
      mutation NextGame($matchId: String!) {
        nextGame(matchId: $matchId) {
          matchId
          gameId
          game {
            team1_score
            team2_score
            servingTeam
          }
        }
      }
    `,
    { variables: { matchId } }
  );

  useEffect(() => {
    document.addEventListener("keydown", addArcadeListeners);
    function addArcadeListeners(e) {
      if (e.key === "w" || "q" || "a" || "s") {
        nextGame().then(res => {
          dispatch(initializeGameAction({ data: res.data.nextGame, history }));
        });
      }
    }

    return () => {
      document.removeEventListener("keydown", addArcadeListeners);
    };
  }, [dispatch, history, nextGame]);

  if (winner.match) {
    setTimeout(() => {
      dispatch({ type: EXIT_GAME });
      history.push("/match");
    }, 5000);
  }
  return winner.match ? (
    <div className="winner-screen">
      <p>Match Winner {winner.match}</p>
      <button
        className="btn--full-width"
        onClick={() => {
          dispatch({ type: EXIT_GAME });
          history.push("/match");
        }}>
        New Match
      </button>
    </div>
  ) : (
    <div className="winner-screen pi-focused">
      <p>Game winner {winner.game}</p>
      <button
        className="btn--full-width"
        onClick={() => {
          nextGame().then(res => {
            dispatch(
              initializeGameAction({ data: res.data.nextGame, history })
            );
          });
        }}>
        {mutationLoading ? "Loading..." : "Next Game"}
      </button>
    </div>
  );
}
