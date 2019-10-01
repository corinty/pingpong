import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useSubscribeToGame from "../hooks/useSubscribeToGame";

export default function ScoreBoard() {
    const { loading, isOpen } = useSubscribeToGame(false);
    const state = useSelector(state => ({
        team1: { name: state.match.team1_name, score: state.game.team1_score },
        team2: { name: state.match.team2_name, score: state.game.team2_score },
        game: state.game,
        match: state.match,
        isMatchOver: state.match.winner !== null,
        matchId: state.app.matchId,
        gameId: state.app.gameId,
        matchWinner: state.match.winner,
        gameWinner: state.game.winner,
    }));
    const { game, match, matchId, gameId, isMatchOver, matchWinner, gameWinner } = state;
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
                {!game.winner && (
                    <>
                        <TeamScore
                            score={game[`${greenTeam}_score`]}
                            team={match[`${greenTeam}_name`]}
                            green
                        />
                        <TeamScore
                            score={game[`${blueTeam}_score`]}
                            team={match[`${blueTeam}_name`]}
                        />
                    </>
                )}
                {game.winner && (
                    <div className="winner-state">
                        <p>
                            {isMatchOver
                                ? `${state[matchWinner].name} wins the match!`
                                : `${state[gameWinner].name} wins the game!`}
                        </p>
                    </div>
                )}
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
