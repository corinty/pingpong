import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useSubscribeToGame from "../hooks/useSubscribeToGame";

export default function ScoreBoard() {
  const { loading, isOpen } = useSubscribeToGame(false);
  const { game, match, matchId, gameId } = useSelector(state => ({
    game: state.game,
    match: state.match,
    matchId: state.app.matchId,
    gameId: state.app.gameId
  }));
  const { greenTeam } = game;
  const blueTeam = game.greenTeam === "team1" ? "team2" : "team1";
  const gamesPlayed = match.gamesWon?.team1 + match.gamesWon?.team2;

  return !loading ? (
    !matchId ? (
      <div className="scoreboard">
        <p className="open-table">
          Table
          <br /> Open
        </p>
      </div>
    ) : (
      <div className="scoreboard">
        <div className="games-played" style={{ gridColumn: "span 2" }}>
          <p>
            Game {isNaN(gamesPlayed) ? 0 : gamesPlayed} of {match.gamesToWin}
          </p>
        </div>
        <TeamScore
          score={game[`${greenTeam}_score`]}
          team={match[`${greenTeam}_name`]}
          green
        />
        <TeamScore
          score={game[`${blueTeam}_score`]}
          team={match[`${blueTeam}_name`]}
        />
      </div>
    )
  ) : (
    <p>Loading...</p>
  );
}

function TeamScore({ score, team, green }) {
  return (
    <div className={`team-score ${green ? "green" : ""}`}>
      <h1>{team}</h1>
      <div className="scoreboard__score">{score}</div>
    </div>
  );
}
