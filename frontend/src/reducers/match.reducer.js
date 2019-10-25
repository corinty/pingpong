import { UPDATE_MATCH, EXIT_GAME, INITIALIZE_MATCH, DECLARE_WINNER } from "../store/types";

export const matchInitial = {
    totalGamesPlayed: 0,
    winner: null,
};
export default function gameReducer(state = matchInitial, action) {
    switch (action.type) {
        case INITIALIZE_MATCH:
            return action.payload.match;

        case UPDATE_MATCH:
            return {
                ...state,
                ...action.payload,
            };

        case EXIT_GAME:
            return {};

        default:
            return state;
    }
}
