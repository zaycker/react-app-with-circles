import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import renderPointsToCircle from 'pointscircles';
import styles from './PointsView.module.css';

function PointsView({ points, radius }) {
    const container = useCallback(node => {
        if (node !== null) {
            node.innerHTML = '';
            renderPointsToCircle(points, radius, node);
        }
    }, [points, radius]);

    return (
        <div className={styles['points-view']} ref={container} />
    );
}

PointsView.propTypes = {
    points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    radius: PropTypes.number,
};

PointsView.defaultProps = {
    points: [],
    radius: 0,
};

export default PointsView;