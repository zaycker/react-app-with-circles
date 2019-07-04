export const SAVE = Symbol('change or create group');
export const DELETE = Symbol('delete group');

export const saveGroup = (group) => ({
    type: SAVE,
    payload: group
});

export const deleteGroup = (groupId) => ({
    type: DELETE,
    payload: groupId
});

export default {
    saveGroup,
    deleteGroup
};
