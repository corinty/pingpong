import { FieldValue } from "../db";

export function checkGame({ team, gameDoc, matchDoc, updatedScore }) {
  const team1 = team === "team1" ? updatedScore : gameDoc.data().team1_score;
  const team2 = team === "team2" ? updatedScore : gameDoc.data().team2_score;
  const pointsToWin = matchDoc.data().pointsToWin;

  if ((team1 >= pointsToWin || team2 >= pointsToWin) && Math.abs(team1 - team2) > 1) {
    return { winner: team1 > team2 ? "team1" : "team2", gameOver: true };
  } else {
    return { gameOver: false };
  }
}

export function processGameOver({
  winner,
  matchDoc,
  matchRef,
  gameRef,
  transaction,
  teamScore,
  updatedScore,
  gameOver,
}) {
  let wins = matchDoc.data().gamesWon;
  wins[winner] = wins[winner] + 1;

  const matchWinner = checkMatch({ wins, gamesToWin: matchDoc.data().gamesToWin });

  transaction.update(matchRef, { gamesWon: wins });
  transaction.update(gameRef, { winner, [teamScore]: updatedScore });
  console.log(matchWinner);

  if (matchWinner === "team1" || matchWinner === "team2") {
    console.log("there is a match winner");

    transaction.update(matchRef, {
      winner: matchWinner,
      finishedAt: FieldValue.serverTimestamp(),
    });
  } else if (matchWinner) {
    transaction.update(matchRef, {
      matchOver: true,
      finishedAt: FieldValue.serverTimestamp(),
    });
  }
}

export function checkMatch({ wins, gamesToWin }) {
  console.log(wins, gamesToWin, wins.team1 + wins.team2);
  console.log(wins.team1 >= gamesToWin);

  if (gamesToWin === 3 && wins.team1 + wins.team2 >= 3) {
    console.log("inside");

    return true;
  }

  if (wins.team1 >= gamesToWin || wins.team2 >= gamesToWin) {
    return wins.team1 > wins.team2 ? "team1" : "team2";
  } else {
    return false;
  }
}
