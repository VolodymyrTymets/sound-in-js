import React from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css'
import './styles.css';

export const Example2Container = ({ playState, progress, volumeLevel, onPlayBtnClick, isActive, onVolumeChange }) =>
  <div>
    <h4>Example 1: <small className="text-muted">Audio element</small></h4>
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
        <div className="btn-group btn-group-toggle" data-toggle="buttons">
          <button
            type="button"
            className={`btn btn-secondary ${isActive(playState, 'play')}`}
            onClick={onPlayBtnClick('play')}
          >
            <i className="fas fa-play"></i>
          </button>
          <button
            type="button"
            className={`btn btn-secondary ${isActive(playState, 'stop')}`}
            onClick={onPlayBtnClick('stop')}
          >
            <i className="fas fa-stop"></i>
          </button>
        </div>
        <div className="player-volume-control mt-2">
          <p>Volume:</p>
          <div className="range-select mt-1">
            <InputRange
              maxValue={100}
              minValue={0}
              value={{ min: 0, max: volumeLevel }}
              onChange={onVolumeChange}
            />
          </div>
        </div>
      </div>
    </div>
  </div>;