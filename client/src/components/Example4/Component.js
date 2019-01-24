import React from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css'
import './styles.css';

export const Example4Container = ({ playState, progress, volumeLevel, loading, onPlayBtnClick, onVolumeChange, onStopBtnClick, onProgressClick }) =>
  <div>
    <h4>Example 4: <small className="text-muted">Sound visualization</small></h4>

    <div className="bars-wrapper">
      <canvas className="frequency-bars" width="1024" height="100"></canvas>
      <canvas className="sinewave" width="1024" height="100"></canvas>
    </div>

    <div className="player mt-4">
      <div className="progress player-progress mb-2" onClick={onProgressClick}>
        <div
          className="progress-bar bg-warning"
          role="progressbar"
          style={{width: `${progress}%`}}
          aria-valuemax="100"
          onClick={e => console.log(e)}
        >
        </div>
      </div>
      <div className="player-controls mt-2">

        <div>{loading && <i className="fas fa-spinner fa-spin"></i>}</div>

        <button
          type="button"
          className="btn btn-warning"
          onClick={playState === 'play' ? onPlayBtnClick : onStopBtnClick}
          disabled={loading}>
          <i className={`fas fa-${playState}`}></i>
        </button>

        <div className="player-volume-control">
          <i onClick={() => onVolumeChange({ max: 0 })} className="fas fa-volume-down"></i>
          <div className="range-select">
            <InputRange
              maxValue={100}
              minValue={0}
              value={{ min: 0, max: volumeLevel }}
              onChange={onVolumeChange}
            />
          </div>
          <i onClick={() => onVolumeChange({ max: 100 })}  className="fas fa-volume-up"></i>
        </div>
      </div>
    </div>

    <h4 className="text-center mt-5">
      <a href="https://github.com/VolodymyrTymets/sound-in-js/tree/master/client/src/components/Example4" target='blank'>
        See code example here
      </a>
    </h4>
  </div>;
