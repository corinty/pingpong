import { print } from "graphql/language/printer";
import express from "express";
import { db, FieldValue } from "./db";
const { importSchema } = require("graphql-import");
const { ApolloServer, ApolloError, ValidationError, gql } = require("apollo-server-express");
const typeDefs = importSchema("./src/schema.graphql");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Active: {
      async match(active) {
        try {
          const matchRef = await db.doc(`matches/${active.matchId}`).get();
          return matchRef.data();
        } catch (error) {
          throw new ApolloError(error);
        }
      },
      async game(active) {
        try {
          const gameRef = await db.doc(`matches/${active.matchId}/games/${active.gameId}`).get();
          return gameRef.data();
        } catch (error) {
          throw new ApolloError(error);
        }
      },
    },
  },
  context: { db, FieldValue },
});

var app = express();

server.applyMiddleware({ app });

app.get("/", (req, res) => {
  res.send("How you doin");
});

app.listen(5001);

console.log(`Running a GraphQL API server at http://localhost:5001${server.graphqlPath}`);
