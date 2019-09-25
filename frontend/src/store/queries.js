import { gql } from "apollo-boost";

export const ACTIVE_MATCH_QUERY = gql`
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
