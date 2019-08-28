const { db } = require("../db");
const firebase = require("firebase-admin");

const { ApolloError } = require("apollo-server");

const Query = {
  async activeMatch(par, args, ctx, info) {
    const activeIdRef = await db.doc("app/activeIds").get();

    return activeIdRef.data();
  }
};

module.exports = Query;
