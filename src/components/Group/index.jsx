import React, { useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './Group.module.css';

const isSuitable = ([x, y, z], radius) => Math.sqrt(x*x + y*y + z*z) <= radius;

const useOnInputChange = ({ group, onChange }, [_, setDirty]) =>
    useCallback((e) => {
        setDirty(true);
        onChange({
            ...group,
            [e.target.name]: e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value
        });
    }, [group, onChange, setDirty]);

const useOnSubmit = ({ group, onSave }, [_, setDirty]) =>
    useCallback((e) => {
        e.preventDefault();
        onSave(group);
        setDirty(false);
    }, [group, onSave, setDirty]);

const useAddPoint = ({ group, onChange }, [_, setCoordinateError], [__, setDirty], formRef) =>
    useCallback((e) => {
        e.preventDefault();

        const form = formRef.current;
        if (!form) {
            return;
        }

        // don't want to make controlled input without redux-form or final-form or kind of these
        const coordinates = form.coordinates.value.split(/\s*,\s*|\s+/).map(value => parseFloat(value));
        if (coordinates.length !== 3 || coordinates.some(isNaN)) {
            setCoordinateError(true);
            return;
        }

        setDirty(true);
        onChange({
            ...group,
            points: [
                ...group.points || [],
                coordinates,
            ]
        });
        form.coordinates.value = '';

    }, [group, onChange, setCoordinateError, setDirty, formRef]);

const useRemovePoint = ({ group, onChange }, [_, setDirty]) =>
    useCallback((e) => {
        const pointIndexToRemove = parseInt(e.target.getAttribute('data-point-index'), 10);
        setDirty(true);
        onChange({
            ...group,
            points: [
                ...group.points.slice(0, pointIndexToRemove),
                ...group.points.slice(pointIndexToRemove + 1)
            ]
        });
    }, [group, onChange, setDirty]);

function Group(props) {
    const { group, onCancel } = props;
    const formRef = useRef(null);
    const coordinatesErrorState = useState(false);
    const dirtyState = useState(false);

    const onInputChange = useOnInputChange(props, dirtyState);
    const onSubmit = useOnSubmit(props, dirtyState);
    const addPoint = useAddPoint(props, coordinatesErrorState, dirtyState, formRef);
    const removePoint = useRemovePoint(props, dirtyState);

    const [coordinateError, setCoordinateError] = coordinatesErrorState;
    const resetCoordinateError = useCallback(() => setCoordinateError(false), [setCoordinateError]);

    const [isDirty] = dirtyState;

    return (
        <form onSubmit={onSubmit} ref={formRef}>
            <h1 className={styles.header}>Group</h1>

            <label className={styles.label}>
                <span className={styles.label__text}>Name</span>
                <input
                    type="text"
                    name="name"
                    value={group.name}
                    onChange={onInputChange}
                    className={styles.input}
                />
            </label>

            <label className={styles.label}>
                <span className={styles.label__text}>Radius</span>
                <input
                    type="number"
                    name="radius"
                    defaultValue={isNaN(group.radius) ? '0' : group.radius}
                    onChange={onInputChange}
                    className={styles.input}
                />
            </label>

            <h2 className={styles.subheader}>Points</h2>
            <label className={styles.label}>
                <span className={styles.label__text}>Coordinates</span>
                <input
                    type="text"
                    name="coordinates"
                    className={cx(
                        styles.input,
                        coordinateError && styles.input__error
                    )}
                    onChange={resetCoordinateError}
                />
                <button onClick={addPoint}>Add</button>
            </label>
            <div className={styles.tip}>
                Examples:
                <ul className={styles.tip__list}>
                    <li>1.2, -3.4, 5.6</li>
                    <li>1.2 -3.4 5.6</li>
                </ul>
            </div>

            <ul className={styles.points}>
                {group.points.map((point, index) => (
                    <li
                        key={`${point}-${index}`}
                        className={cx(styles.point, !isSuitable(point, group.radius) && styles.point_unsuitable)}
                        data-point-index={index}
                        onClick={removePoint}
                        title="Remove"
                    >
                        ({point.join(',')})
                    </li>
                ))}
            </ul>

            <button type="submit" disabled={!isDirty}>Save</button>
            <button type="button" onClick={onCancel}>{isDirty ? 'Cancel' : 'Back'}</button>
        </form>
    );
}

Group.propTypes = {
    group: PropTypes.shape().isRequired,
    onChange: PropTypes.func,
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
};

Group.defaultProps = {
    groups: {},
    onChange: Function.prototype,
    onCancel: Function.prototype,
    onSave: Function.prototype,
};

export default Group;