import React, { useState, useEffect, useReducer } from "react";

import styled from "styled-components";

const Container = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: 1fr 150px 1fr;
  grid-template-rows: 100px 1fr;
`;

function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      let switchServe = state.serveNum === 5;
      return {
        ...state,
        [action.team]: state[action.team] + 1,
        serveNum: state.serveNum === 5 ? 1 : state.serveNum + 1,
        whoServes: switchServe
          ? state.whoServes === 1
            ? 2
            : 1
          : state.whoServes
      };
    case "DECREMENT":
      if (state[action.team] === 0) return state;
      return {
        ...state,
        [action.team]: state[action.team] - 1,
        serveNum: state.serveNum === 1 ? 5 : state.serveNum - 1
      };
    default:
      throw new Error("No action.type found");
  }
}

function App() {
  const [winner, setWinner] = useState(null);
  const [state, dispatch] = useReducer(reducer, {
    team1: 0,
    team2: 0,
    whoServes: 1,
    serveNum: 1,
    playTill: 2
  });

  /**
   * useState Hooks
   */

  const { team1, team2, serveNum, whoServes, playTill } = state;

  useEffect(() => {
    document.addEventListener("keydown", e => {
      switch (e.key) {
        case "q":
          dispatch({ type: "INCREMENT", team: "team1" });
          break;
        case "a":
          dispatch({ type: "DECREMENT", team: "team1" });
          break;
        case "w":
          dispatch({ type: "INCREMENT", team: "team2" });
          break;
        case "s":
          dispatch({ type: "DECREMENT", team: "team2" });
          break;
        default:
      }
    });
    return () => {
      document.removeEventListener("keydown");
    };
  }, []);

  useEffect(() => {
    const checkForWinner = team1 >= playTill || team2 >= playTill;
    if (checkForWinner && Math.abs(team1 - team2) > 1) {
      setWinner(team1 > team2 ? "Team One" : "Team Two");
    }
  }, [team1, playTill, team2]);

  return (
    <Container>
      <div className="score">
        Team One: {team1} <span />
      </div>
      <div>{winner && <p>The winner is {winner.toString()}</p>}</div>
      <div className="score">
        Team Two: {team2} <span />
      </div>

      <div
        className="btn--increment"
        onClick={() => dispatch({ type: "INCREMENT", team: "team1" })}>
        Team One {whoServes === 1 && "is serving."}
      </div>
      <div className="spacer">{serveNum}</div>
      <div
        className="btn--increment"
        onClick={() => dispatch({ type: "INCREMENT", team: "team2" })}>
        Team Two {whoServes === 2 && "is serving."}
      </div>
    </Container>
  );
}

export default App;
