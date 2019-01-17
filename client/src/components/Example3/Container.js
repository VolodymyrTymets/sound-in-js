import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { Example3Container } from './Component';

const getOscillator = (startFrequency) => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(startFrequency, audioCtx.currentTime);
  oscillator.connect(audioCtx.destination);

  const start = () => oscillator.start();
  const stop = () => oscillator.stop();
  const change = frequency =>
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime); // value in hertz

  return { start, stop, change };
};

export const Example3 = compose(
  withState('frequency', 'setFrequency', 0),
  withState('playState', 'setPlayState', 'play'),
  withState('oscillator', 'setOscillator', null),
  withHandlers({
    onPlayBtnClick: (props) => async () => {
      let { oscillator, frequency } = props;
      oscillator = oscillator || getOscillator(frequency);
      props.setOscillator(oscillator);
      oscillator.start();
      return props.setPlayState('stop');
    },
    onStopBtnClick: props => () => {
      const { oscillator } = props;
      oscillator && oscillator.stop();
      props.setPlayState('play');
    },
    onFrequencyChange: ({ oscillator, setFrequency }) => ({max}) => {
      oscillator && oscillator.change(max);
      setFrequency(max);
    },
  })
)(Example3Container);
