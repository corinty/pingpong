import { ApolloError } from "apollo-server";
import updateScore from "./mutations/updateScore";

const uuid = require("uuid/v4");

const Mutations = {
  async createMatch(parent, args, ctx) {
    try {
      const { team1_name, team2_name, pointsToWin, gamesToWin, ...restArgs } = args;
      console.log(team1_name);

      const newMatch = await ctx.db.collection("matches").add({
        gamesToWin,
        pointsToWin,
        team1_name: team1_name.length > 0 ? team1_name : "Team 1",
        team2_name: team2_name.length > 0 ? team2_name : "Team 2",
        startedAt: ctx.FieldValue.serverTimestamp(),
        winner: null,
        gamesWon: {
          team1: 0,
          team2: 0,
        },
        ...restArgs,
      });

      const newGame = await newMatch.collection("games").add({
        team1_score: 0,
        team2_score: 0,
        greenTeam: "team1",
        servingTeam: "team1",
      });

      const matchRef = await newMatch.get();
      const newGameRef = await newGame.get();

      await ctx.db.doc("app/activeIds").update({
        matchId: matchRef.id,
        gameId: newGameRef.id,
      });
      const activeIdDoc = await ctx.db.doc("app/activeIds").get();

      return activeIdDoc.data();
    } catch (err) {
      throw new ApolloError(err);
    }
  },
  updateScore: (parent, args, ctx) => updateScore(parent, args, ctx),
  async declareWinner(par, args, ctx) {},
  /**
   * Creates a new game that is attached to the matchId from
   * the args.  Then it updates the active gameId from the app
   * collection.
   *
   * returns the activeIds document
   */
  async nextGame(par, args, ctx) {
    const { prevGreenTeam } = args;

    const newGame = await ctx.db
      .collection("matches")
      .doc(args.matchId)
      .collection("games")
      .add({
        team1_score: 0,
        team2_score: 0,
        servingTeam: "team1",
        greenTeam: prevGreenTeam === "team1" ? "team2" : "team1",
      });

    await ctx.db.doc("app/activeIds").update({
      gameId: newGame.id,
    });
    const activeRef = await ctx.db.doc("app/activeIds").get();

    return activeRef.data();
  },
};

module.exports = Mutations;
