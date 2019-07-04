import React, { useReducer, useState, useCallback, useMemo, useEffect } from 'react';
import PointsView from './components/PointsView';
import Groups from './components/Groups';
import Group from './components/Group';
import groupsReducer from './reducers/groups';
import { useMapDispatchToActions, uniqueId } from './utils';
import pureGroupsActions from './actions/groups';
import styles from './App.module.css';

const GROUPS_LOCALSTORAGE_KEY = 'circle-groups';

const saveGroupsIntoLocalStorage = (groups) => {
    window.localStorage.setItem(GROUPS_LOCALSTORAGE_KEY, JSON.stringify(groups));
};

const loadGroupsFromLocalStorage = () => {
    try {
        return JSON.parse(window.localStorage.getItem(GROUPS_LOCALSTORAGE_KEY)) || [];
    } catch (e) {
        return [];
    }
};

const useGroups = () => {
    const [groups, dispatch] = useReducer(groupsReducer, loadGroupsFromLocalStorage());
    const [activeGroup, setActiveGroup] = useState(null);
    const groupsActions = useMapDispatchToActions(dispatch, pureGroupsActions);

    const createGroup = useCallback(() => {
        setActiveGroup({
            id: uniqueId(Date.now()),
            name: '',
            radius: 0,
            points: []
        })
    }, []);

    const editGroup = useCallback((groupId) => {
        setActiveGroup(groups.find(({ id }) => id === groupId))
    }, [groups]);

    const onChange = useCallback((group) => {
        setActiveGroup(group);
    }, []);

    const onSave = useCallback(() => {
        groupsActions.saveGroup(activeGroup);
    }, [activeGroup, groupsActions]);

    const onCancel = useCallback(() => {
        setActiveGroup(null);
    }, []);

    useEffect(() => {
        saveGroupsIntoLocalStorage(groups);
    }, [groups]);

    return [groups, activeGroup, {
        createGroup,
        editGroup,
        onChange,
        onSave,
        onCancel,
        deleteGroup: groupsActions.deleteGroup,
    }];
};

function App() {
    const [groups, activeGroup, groupsActions] = useGroups();

    const activeGroupPoints = useMemo(() => (activeGroup && activeGroup.points) || [], [activeGroup]);
    const activeGroupRadius = useMemo(() => (activeGroup && activeGroup.radius) || 0, [activeGroup]);

    return (
        <div className={styles.app}>
            <div className={styles.left}>
                {!activeGroup && <Groups
                    groups={groups}
                    onSelect={groupsActions.editGroup}
                    onRemove={groupsActions.deleteGroup}
                    onCreate={groupsActions.createGroup}
                />}
                {activeGroup && <Group
                    group={activeGroup}
                    onChange={groupsActions.onChange}
                    onCancel={groupsActions.onCancel}
                    onSave={groupsActions.onSave}
                />}
            </div>
            <div className={styles.right}>
                <PointsView
                    points={activeGroupPoints}
                    radius={activeGroupRadius}
                />
            </div>
        </div>
    );
}

export default App;
