import React, { useState, useEffect, useReducer } from "react";
import styled from "styled-components";
import "./App.css";

const Container = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: 1fr 150px 1fr;
  grid-template-rows: 100px 1fr;
`;

function updateObject(prevState, newValues) {
  return Object.assign({}, prevState, newValues);
}

function App() {
  const [serveNum, setServeNum] = useState(1);
  const [whoServes, setWhoServes] = useState(false);

  function reducer(state, action) {
    switch (action.type) {
      case "INCREMENT":
        return updateObject(state, { [action.team]: state[action.team] + 1 });
      case "DECREMENT":
        return updateObject(state, { [action.team]: state[action.team] - 1 });
      default:
        throw new Error("No action.type found");
    }
  }
  const [state, dispatch] = useReducer(reducer, {
    team1: 0,
    team2: 0,
    serveNum: 1
  });

  /**
   * useState Hooks
   */

  const { team1, team2 } = state;

  // TODO:: Refactor check for winner
  // const checkForWinner = () => {
  //   const diff = Math.abs(team1 - team2);

  //   if (diff >= 2) {
  //     console.log(
  //       "We have a winner",
  //       team1 > team2 ? "team one wins" : "team two wins"
  //     );
  //     setScore({ team1: 0, team2: 0 });
  //   }
  // };

  // const logScore = newTeamScore => {
  //   if (serveNum === 5) {
  //     setServeNum(1);
  //     setWhoServes(!whoServes);
  //   } else {
  //     setServeNum(serveNum + 1);
  //   }
  //   setScore(prevScores => ({ ...prevScores, ...newTeamScore }));
  // };

  // useEffect(() => {
  //   if (team1 >= 20 || team2 >= 20) {
  //     checkForWinner();
  //   }
  // });

  return (
    <Container
      onKeyDown={e => {
        console.log("sah");
      }}>
      <div className="score">
        Team One: {team1} <span />
      </div>
      <div>Game #</div>
      <div className="score">
        Team Two: {team2} <span />
      </div>

      <div
        className="btn--increment"
        onClick={() => dispatch({ type: "INCREMENT", team: "team1" })}>
        Team One {!whoServes && "is serving."}
      </div>
      <div className="spacer">{serveNum}</div>
      <div
        className="btn--increment"
        onClick={() => dispatch({ type: "INCREMENT", team: "team2" })}>
        Team Two {whoServes && "is serving."}
      </div>
    </Container>
  );
}

export default App;
