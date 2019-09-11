import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { __RouterContext } from "react-router-dom";
import { initializeGameAction } from "../store/actions/actions";
import { EXIT_GAME } from "../store/types";

export default function Winner({ winner, matchId }) {
  const { history } = useContext(__RouterContext);
  const dispatch = useDispatch();
  const greenTeam = useSelector(state => state.game.greenTeam);
  const teamNames = useSelector(state => ({
    team1: state.match.team1_name,
    team2: state.match.team2_name
  }));

  const [nextGame, { loading: mutationLoading }] = useMutation(
    gql`
      mutation NextGame($matchId: String!, $prevGreenTeam: TeamEnum!) {
        nextGame(matchId: $matchId, prevGreenTeam: $prevGreenTeam) {
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
    { variables: { matchId, prevGreenTeam: greenTeam } }
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

  return (
    <div className="winner-screen pi-focused">
      <p>
        {winner.match
          ? `${teamNames[winner.match]} wins the Match!`
          : `${teamNames[winner.game]} wins the Game!`}
      </p>
      <button
        className="btn--full-width"
        onClick={() => {
          if (winner.match) {
            dispatch({ type: EXIT_GAME });
            history.push("/match");
          } else {
            nextGame().then(res => {
              dispatch(
                initializeGameAction({ data: res.data.nextGame, history })
              );
            });
          }
        }}>
        {winner.match
          ? "New Match"
          : !mutationLoading
          ? "Next Game"
          : "Loading..."}
      </button>
    </div>
  );
}
