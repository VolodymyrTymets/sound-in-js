import React from 'react';
import { compose, lifecycle, withState, withHandlers, withProps } from 'recompose';
import { loadFile } from './utils';
import { Example4Container } from './Component';

export const Example4 = compose(
  withState('volumeLevel', 'setVolumeLevel', 100),
  withState('progress', 'setProgress', 0),
  withState('playState', 'setPlayState', 'play'),
  withState('loading', 'setLoading', false),
  withState('player', 'setPlayer', null),
  withState('audionState', 'setAudionState', {
    startedAt: null,
    pausedAt: null,
    isPause: true,
    duration: 0,
  }),
  withProps(({ audionState, setAudionState }) => ({
    changeAudionState: newState => setAudionState({ ...audionState, ...newState }),
  })),
  withHandlers({
    onPlayBtnClick: (props) => async () => {
      const { player, audionState } = props;

      try {
        if(!player) {
          props.setLoading(true);
          const frequencyC = document.querySelector('.frequency-bars');
          const sinewaveC = document.querySelector('.sinewave');
          const newPlayer = await loadFile('/api/v1/track', {
            frequencyC,
            sinewaveC
          }, {
            fillStyle: 'rgb(250, 250, 250)', // background
            strokeStyle: 'rgb(251, 89, 17)', // line color
            lineWidth: 1,
            fftSize: 16384 // delization of bars from 1024 to 32768
          });

          props.setLoading(false);
          props.setPlayer(newPlayer);
          props.changeAudionState({
            startedAt: Date.now(),
            isPause: false,
            duration: newPlayer.duration,
          });

          newPlayer.play(0);
          return props.setPlayState('stop');
        }

        props.changeAudionState({
          startedAt: Date.now() - audionState.pausedAt,
          isPause: false,
        });

        player.play(audionState.pausedAt / 1000);

        return props.setPlayState('stop');
      } catch (e) {
        props.setLoading(false);
        console.log(e);
      }
    },
    onStopBtnClick: props => () => {
      const { player, audionState  } = props;
      props.changeAudionState({
        pausedAt:  Date.now() - audionState.startedAt,
        isPause: true,
      });
      player && player.stop();
      props.setPlayState('play');
    },
    onVolumeChange: props => ({ max }) => {
      const value = max / 100;
      const level = value > 0.5 ? value * 4 : value * -4;
      props.player.setVolume(level || -1);

      props.setVolumeLevel(max || 0)
    },
    onProgressClick: props => (e) => {
      const { player, audionState } = props;

      const rate = (e.clientX * 100) / e.target.offsetWidth;
      const playbackTime = (audionState.duration * rate) / 100;

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
        const { startedAt, isPause, duration } = this.props.audionState;
        if(startedAt && !isPause) {
          const playbackTime = (Date.now() - startedAt) / 1000;
          const rate = parseInt((playbackTime * 100) / duration, 10);
          rate <= 100 && this.props.setProgress(rate);
        }
      },1000)
    }
  })
)(Example4Container);
