const { ApolloError } = require("apollo-server");
const uuid = require("uuid/v4");

const Mutations = {
  async createMatch(parent, args, ctx) {
    try {
      const {
        team1_name,
        team2_name,
        pointsToWin,
        gamesToWin,
        ...restArgs
      } = args;

      const newMatch = await ctx.db.collection("matches").add({
        gamesToWin,
        pointsToWin,
        team1_name,
        team2_name,
        startedAt: ctx.FieldValue.serverTimestamp(),
        ...restArgs
      });

      const newGame = await newMatch.collection("games").add({
        team1_score: 0,
        team2_score: 0,
        servingTeam: "team1"
      });

      const matchRef = await newMatch.get();
      const newGameRef = await newGame.get();

      await ctx.db.doc("app/activeIds").update({
        matchId: matchRef.id,
        gameId: newGameRef.id
      });
      const activeIdDoc = await ctx.db.doc("app/activeIds").get();

      return activeIdDoc.data();
    } catch (err) {
      throw new ApolloError(err);
    }
  },
  async updateScore(parent, args, ctx) {
    try {
      /**
       * Grabs the inital reference to the current game
       */
      const gameRef = await ctx.db.doc(
        `matches/${args.matchId}/games/${args.gameId}`
      );

      /**
       * Checks to see if score would go negative
       * if it would then it just returns
       */
      if (args.score - 1 < 0 && !args.increment) {
        const gameDoc = await gameRef.get();

        return gameDoc.data();
      }
      /**
       * Updates the score based on the incremeant argument
       */
      await gameRef.update({
        [`${args.team}_score`]: ctx.FieldValue.increment(
          args.increment ? 1 : -1
        ),
        serveNum: 3
      });

      /**
       * Grabs the document from the reference
       */
      const gameDoc = await gameRef.get();

      /**
       * Returns the updated game document
       */
      return gameDoc.data();
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  async declareWinner(par, args, ctx) {
    try {
      // Incremeants the match winner on the match document
      await ctx.db.doc(`matches/${args.matchId}`).update({
        [`gamesWon.${args.winner}`]: ctx.FieldValue.increment(1)
      });

      // Declares the winner on the game document
      await ctx.db
        .doc(`matches/${args.matchId}/games/${args.gameId}`)
        .update({ winner: args.winner });

      // Grabs the match Reference and then the data from the document
      const matchRef = await ctx.db.doc(`matches/${args.matchId}`).get();
      const matchData = await matchRef.data();

      const {
        gamesWon: { team1, team2 },
        gamesToWin
      } = matchData;

      //If one of the teams have won enough games then declare the winner of the match
      if (team1 >= gamesToWin || team2 >= gamesToWin) {
        await ctx.db.doc(`matches/${args.matchId}`).update({
          winner: args.winner,
          finishedAt: ctx.FieldValue.serverTimestamp()
        });

        const updatedMatchRef = await ctx.db
          .doc(`matches/${args.matchId}`)
          .get();
        await ctx.db.doc("app/activeIds").set({ matchId: "", gameId: "" });
        const updatedMatchData = await updatedMatchRef.data();

        return updatedMatchData;
      } else {
        //If there's no match winner return the match data
        return matchData;
      }
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  /**
   * Creates a new game that is attached to the matchId from
   * the args.  Then it updates the active gameId from the app
   * collection.
   *
   * returns the activeIds document
   */
  async nextGame(par, args, ctx) {
    const newGame = await ctx.db
      .collection("matches")
      .doc(args.matchId)
      .collection("games")
      .add({
        team1_score: 0,
        team2_score: 0,
        servingTeam: "team1"
      });

    await ctx.db.doc("app/activeIds").update({
      gameId: newGame.id
    });
    const activeRef = await ctx.db.doc("app/activeIds").get();
    console.log(activeRef.data());

    return activeRef.data();
  }
};

module.exports = Mutations;
