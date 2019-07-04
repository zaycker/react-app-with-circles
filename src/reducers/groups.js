import { SAVE, DELETE } from '../actions/groups';

export default function reducer(state, action) {
    switch (action.type) {
        case SAVE:
            const group = action.payload;
            const groupIndex = state.findIndex(({ id }) => id === group.id);

            if (groupIndex === -1) {
                return state.concat(group);
            }

            return [
                ...state.slice(0, groupIndex),
                group,
                ...state.slice(groupIndex + 1)
            ];
        case DELETE:
            return state.filter(({ id }) => id !== action.payload);
        default:
            return state;
    }
}