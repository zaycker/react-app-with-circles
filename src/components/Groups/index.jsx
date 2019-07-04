import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './Groups.module.css';

const useOnClick = (onHandler) =>
    useCallback((e) => {
        e.preventDefault();
        onHandler(e.target.getAttribute('data-id'));
    }, [onHandler]);

function Groups({ groups, onSelect, onRemove, onCreate }) {
    const onGroupClick = useOnClick(onSelect);
    const onRemoveGroupClick = useOnClick(onRemove);

    return (
        <div className={styles.groups}>
            <h1 className={styles.header}>Groups <button onClick={onCreate}>Add</button></h1>
            <ul className={styles.list}>
                {groups.map(({ id, name, radius }) => (
                    <li key={id} className={styles.list__element}>
                        <a
                            href="/view"
                            data-id={id}
                            className={styles.group}
                            onClick={onGroupClick}
                        >
                            {name} (radius: {radius})
                        </a>
                        <a
                            href="/remove"
                            data-id={id}
                            className={styles.remove}
                            onClick={onRemoveGroupClick}
                        >
                            x
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

Groups.propTypes = {
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    onSelect: PropTypes.func,
    onRemove: PropTypes.func,
    onCreate: PropTypes.func
};

Groups.defaultProps = {
    groups: [],
    onSelect: Function.prototype,
    onRemove: Function.prototype,
    onCreate: Function.prototype
};

export default Groups;