import { ApolloError } from "apollo-server";
import { checkMatch, checkGame, processGameOver } from "../../utils/checkForWinner";

export default async function updateScore(parent, args, ctx) {
  const { increment } = args;
  const teamScore = `${args.team}_score`;
  try {
    console.time("updateScore");
    /**
     * Grabs the inital reference to the current game
     */
    const gameRef = ctx.db.doc(`matches/${args.matchId}/games/${args.gameId}`);
    const matchRef = ctx.db.doc(`matches/${args.matchId}`);

    const updateFunction = async t => {
      const [gameDoc, matchDoc] = await Promise.all([t.get(gameRef), t.get(matchRef)]);
      if (gameDoc.data().winner) return Promise.reject("Game Already has Winner");

      const oldScore = gameDoc.data()[teamScore];
      const updatedScore = increment ? oldScore + 1 : oldScore - 1;
      const { gameOver, winner } = checkGame({
        team: args.team,
        updatedScore,
        matchDoc,
        gameDoc,
      });

      if (gameOver) {
        processGameOver({
          winner,
          matchDoc,
          matchRef,
          gameRef,
          gameOver,
          transaction: t,
          teamScore,
          updatedScore,
        });
      } else {
        /**
         * Update score of game
         */
        t.update(gameRef, { [teamScore]: updatedScore });
        return { [teamScore]: updatedScore };
      }
    };

    let transaction = await ctx.db.runTransaction(updateFunction);

    /**
     * Returns the latest game object
     */
    console.timeEnd("updateScore");
  } catch (error) {
    throw new ApolloError(error);
  }
}
