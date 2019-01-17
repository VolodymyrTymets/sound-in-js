import React from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css'
import './styles.css';


export const Example3Container = ({ playState, frequency, onPlayBtnClick, onStopBtnClick, onFrequencyChange  }) =>
  <div>
    <h4>Example 3: <small className="text-muted">Frequency oscillator</small></h4>

      <div className="example-3-wrapper mt-2">
        <div className="range-select mt-1">
          <InputRange
            maxValue={2000}
            minValue={0}
            value={{ min: 0, max: frequency }}
            onChange={onFrequencyChange}
          />
        </div>

        <button
          type="button"
          className="btn btn-warning"
          onClick={playState === 'play' ? onPlayBtnClick : onStopBtnClick }
         >
          <i className={`fas fa-${playState}`}></i>
        </button>

    </div>
  </div>;
