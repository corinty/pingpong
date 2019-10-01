"use strict";

var _printer = require("graphql/language/printer");

var _express = _interopRequireDefault(require("express"));

var _db = require("./db");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require("graphql-import"),
    importSchema = _require.importSchema;

var _require2 = require("apollo-server-express"),
    ApolloServer = _require2.ApolloServer,
    ApolloError = _require2.ApolloError,
    ValidationError = _require2.ValidationError,
    gql = _require2.gql;

var typeDefs = importSchema("./src/schema.graphql");

var Query = require("./resolvers/Query");

var Mutation = require("./resolvers/Mutation");

var server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: {
    Query: Query,
    Mutation: Mutation,
    Subscription: {
      scoreUpdated: function scoreUpdated(par, args, ctx) {
        console.log("yeet yeet");
      }
    },
    Active: {
      match: function () {
        var _match = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(active) {
          var matchRef;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  _context.next = 3;
                  return _db.db.doc("matches/".concat(active.matchId)).get();

                case 3:
                  matchRef = _context.sent;
                  return _context.abrupt("return", matchRef.data());

                case 7:
                  _context.prev = 7;
                  _context.t0 = _context["catch"](0);
                  throw new ApolloError(_context.t0);

                case 10:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[0, 7]]);
        }));

        function match(_x) {
          return _match.apply(this, arguments);
        }

        return match;
      }(),
      game: function () {
        var _game = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee2(active) {
          var gameRef;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.prev = 0;
                  _context2.next = 3;
                  return _db.db.doc("matches/".concat(active.matchId, "/games/").concat(active.gameId)).get();

                case 3:
                  gameRef = _context2.sent;
                  return _context2.abrupt("return", gameRef.data());

                case 7:
                  _context2.prev = 7;
                  _context2.t0 = _context2["catch"](0);
                  throw new ApolloError(_context2.t0);

                case 10:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, null, [[0, 7]]);
        }));

        function game(_x2) {
          return _game.apply(this, arguments);
        }

        return game;
      }()
    }
  },
  context: {
    db: _db.db,
    FieldValue: _db.FieldValue
  }
});
var app = (0, _express["default"])();
server.applyMiddleware({
  app: app
});
app.get("/", function (req, res) {
  res.send("How you doin");
});
app.listen(5001);
console.log("Running a GraphQL API server at http://localhost:5001".concat(server.graphqlPath));