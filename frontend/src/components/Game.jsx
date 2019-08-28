import React, { useContext, useEffect } from "react";
import { __RouterContext } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { SWAP_SERVE, CLEAR_GAME, EXIT_GAME } from "../store/types";
import useLiveGame from "../hooks/useLiveGame";
import useCheckForWinner from "../hooks/useCheckForWinner";

const Container = styled.div`
  display: grid;
  height: 100%;
  position: relative;
  grid-template-columns: 1fr 50px 1fr;
`;

export default function Game() {
  /**
   * Component data
   */
  const {
    history,
    match: {
      params: { matchId, gameId }
    }
  } = useContext(__RouterContext);

  const dispatch = useDispatch();
  const matchState = useSelector(state => ({
    ...state.match,
    ...state.app,
    game: state.game
  }));

  const { team1_name, team2_name, serveNum, pointsToWin } = matchState;

  const {
    data: { team1_score, team2_score },
    loading
  } = useLiveGame(matchId, gameId);
  const winner = useCheckForWinner({ team1_score, team2_score });

  const [updateScore] = useMutation(
    gql`
      mutation UpdateScore(
        $matchId: String!
        $gameId: String!
        $team: TeamEnum!
        $score: Int!
        $increment: Boolean!
      ) {
        updateScore(
          matchId: $matchId
          gameId: $gameId
          team: $team
          increment: $increment
          score: $score
        ) {
          team1_score
          team2_score
        }
      }
    `,
    { variables: { matchId, gameId } }
  );

  useEffect(() => {
    document.addEventListener("keydown", addArcadeListeners);
    function addArcadeListeners(e) {
      switch (e.key) {
        case "q":
          updateScore({
            variables: {
              team: "team1",
              score: team1_score,
              increment: true
            }
          });
          break;
        case "a":
          updateScore({
            variables: {
              team: "team1",
              score: team1_score,
              increment: false
            }
          });
          break;
        case "w":
          updateScore({
            variables: {
              team: "team2",
              score: team2_score,
              increment: true
            }
          });
          break;
        case "s":
          updateScore({
            variables: {
              team: "team2",
              score: team2_score,
              increment: false
            }
          });
          break;
        default:
      }
    }
    return () => {
      document.removeEventListener("keydown", addArcadeListeners);
    };
  }, [dispatch, team1_score, team2_score, updateScore]);

  // return <p>back to data testing</p>;

  return loading ? null : (
    <Container>
      <div
        className="btn--increment"
        onClick={e => {
          updateScore({
            variables: {
              team: "team1",
              score: team1_score,
              increment: true
            }
          });
        }}>
        <p className="team-name">
          {team1_name && team1_name.length > 0 ? team1_name : "Team 1"}
        </p>
        <p className="score">{team1_score}</p>
      </div>

      <div
        className="center-btns"
        onClick={() => {
          dispatch({ type: EXIT_GAME });
          history.push("/");
        }}
      />

      <div
        className="btn--increment"
        onClick={() => {
          updateScore({
            variables: {
              team: "team2",
              score: team2_score,
              increment: true
            }
          });
        }}>
        <p className="team-name">
          {team2_name && team2_name.length > 0 ? team2_name : "Team 2"}
        </p>
        <p className="score">{team2_score}</p>
      </div>
    </Container>
  );
}
