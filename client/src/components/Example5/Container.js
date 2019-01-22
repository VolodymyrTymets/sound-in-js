import React from 'react';
import { compose, lifecycle, withState, withHandlers, withProps } from 'recompose';
import { loadFile } from './utils';
import { Example5Container } from './Component';

export const Example5 = compose(
  withState('volumeLevel', 'setVolumeLevel', 100),
  withState('progress', 'setProgress', 0),
  withState('playState', 'setPlayState', 'play'),
  withState('loading', 'setLoading', false),
  withState('player', 'setPlayer', null),
  withState('duration', 'setDuration', 0),
  withState('audionState', 'setAudionState', {
    startedAt: null,
    loadingProcess: 0,
  }),
  withProps(({ audionState, setAudionState }) => ({
    changeAudionState: newState =>
      setAudionState({ ...audionState, ...newState }),
  })),
  withHandlers({
    onPlayBtnClick: (props) => async () => {
      const { player } = props;

      try {
        if(!player) {
          props.setLoading(true);
          const frequencyC = document.querySelector('.frequency-bars');
          const sinewaveC = document.querySelector('.sinewave');
          const newPlayer = await loadFile({
            frequencyC,
            sinewaveC
          }, {
            fillStyle: 'rgb(250, 250, 250)', // background
            strokeStyle: 'rgb(251, 89, 17)', // line color
            lineWidth: 1,
            fftSize: 16384 // delization of bars from 1024 to 32768
          }, props);
          props.setLoading(false);
          props.setPlayer(newPlayer);

          return props.setPlayState('stop');
        }

        player.play(0);
        props.changeAudionState({ startedAt: Date.now() });

        return props.setPlayState('stop');
      } catch (e) {
        props.setLoading(false);
        console.log(e);
      }
    },
    onStopBtnClick: props => () => {
      const { player } = props;
      player && player.stop();
      props.setPlayState('play');
    },
    onVolumeChange: props => ({ max }) => {
      const value = max / 100;
      const level = value > 0.5 ? value * 2 : value * -2;
      props.player.setVolume(level || -1);

      props.setVolumeLevel(max || 0)
    },
    onProgressClick: props => (e) => {
      const { player, duration } = props;

      const rate = (e.clientX * 100) / e.target.offsetWidth;
      const playbackTime = (duration * rate) / 100;

      player && player.stop();
      player && player.play(playbackTime);

      props.setProgress(parseInt(rate, 10));
      props.changeAudionState({
        startedAt: Date.now() - playbackTime * 1000,
      });
    }
  }),
  lifecycle({
    componentDidMount() {
      setInterval(() => {
        const { startedAt } = this.props.audionState;
        const { duration } = this.props;

        if(startedAt) {
          const playbackTime = (Date.now() - startedAt) / 1000;
          const rate = parseInt((playbackTime * 100) / duration, 10);
          rate <= 100 && this.props.setProgress(rate);
        }
      },1000)
    }
  })
)(Example5Container);
