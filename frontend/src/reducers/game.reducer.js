import {
    CLEAR_GAME,
    INCREMENT,
    DECREMENT,
    INITIALIZE_GAME,
    INITIALIZE_MATCH,
    UPDATE_GAME,
    EXIT_GAME,
    DECLARE_WINNER,
    UPDATE_LOCAL_GAME,
} from "../store/types";

export const initalGame = {};

export default function gameReducer(state = initalGame, action) {
    switch (action.type) {
        case INITIALIZE_MATCH:
            return { ...action.payload.game };
        case INITIALIZE_GAME:
            return { ...action.payload.game };
        case UPDATE_GAME:
            return action.payload || state;
        case UPDATE_LOCAL_GAME:
            const { team, increment } = action.payload;
            return {
                ...state,
                [`${team}_score`]: increment
                    ? state[`${team}_score`] + 1
                    : state[`${team}_score`] - 1,
            };
        case EXIT_GAME:
            return {};

        default:
            return state;
    }
}
