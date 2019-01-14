import React from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css'
import './styles.css';


export const Example2Container = ({ playState, progress, volumeLevel, loading, onPlayBtnClick, onVolumeChange }) =>
  <div>
    <h4>Example 2: <small className="text-muted">Audio element</small></h4>
    <div className="player">
      <div className="progress">
        <div
          className="progress-bar"
          role="progressbar"
          style={{width: `${progress}%`}}
          aria-valuemax="100"
        >
          {progress}%
        </div>
      </div>
      <div className="player-controls mt-2">

        <div>{loading && <i className="fas fa-spinner fa-spin"></i>}</div>

        <button type="button" className="btn btn-warning" onClick={onPlayBtnClick} disabled={loading}>
          <i className={`fas fa-${playState}`}></i>
        </button>

        <div className="player-volume-control mt-2">
          <i className="fas fa-volume-down"></i>
          <div className="range-select mt-1">
            <InputRange
              maxValue={100}
              minValue={0}
              value={{ min: 0, max: volumeLevel }}
              onChange={onVolumeChange}
            />
          </div>
          <i className="fas fa-volume-up"></i>
        </div>
      </div>
    </div>
  </div>;
