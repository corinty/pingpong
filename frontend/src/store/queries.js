import gql from "graphql-tag";

export const GET_ACTIVE_MATCH = gql`
  query getActiveMatch {
    activeMatch {
      matchId
      gameId
      match {
        gamesToWin
        pointsToWin
        team1_name
        team2_name
      }
      game {
        team1_score
        team2_score
        servingTeam
      }
    }
  }
`;
