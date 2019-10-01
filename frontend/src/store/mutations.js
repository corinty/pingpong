import { gql } from "apollo-boost";

export const UPDATE_SCORE_MUTATION = gql`
    mutation UpdateScore(
        $matchId: String!
        $gameId: String!
        $team: TeamEnum!
        $increment: Boolean!
    ) {
        updateScore(matchId: $matchId, gameId: $gameId, team: $team, increment: $increment) {
            team1_score
            team2_score
            greenTeam
        }
    }
`;

export const DECLARE_WINNER_MUTAION = gql`
    mutation DeclareWinner($matchId: String!, $gameId: String!, $winner: TeamEnum!) {
        declareWinner(matchId: $matchId, gameId: $gameId, winner: $winner) {
            winner
            gamesWon {
                team1
                team2
            }
        }
    }
`;
