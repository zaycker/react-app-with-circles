import {useMemo} from 'react';

// kind of replacement of lodash uniqueId
export const uniqueId = (function () {
    let id = 0;
    return (prefix) => `${prefix || ''}${++id}`;
})();

// kind of mapDispatchToProps, only for memo
export const useMapDispatchToActions = (dispatch, actions) =>
    useMemo(() =>
            Object.keys(actions).reduce((mappedActions, action) =>
                ({
                    ...mappedActions,
                    [action]: (...args) => dispatch(actions[action](...args)),
                }), {}),
        [dispatch, actions]);

export default {};