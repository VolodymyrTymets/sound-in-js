import React from 'react';
import { compose, lifecycle, withState, withHandlers, withProps } from 'recompose';
import { loadFile } from './utils';
import { Example2Container } from './Component';

let startedAt;
let pausedAt;
let isPause = true;
let duration = 0;

export const Example2 = compose(
  withState('volumeLevel', 'setVolumeLevel', 50),
  withState('progress', 'setProgress', 0),
  withState('playState', 'setPlayState', 'play'),
  withState('loading', 'setLoading', false),
  withState('player', 'setPlayer', null),
  withHandlers({
    onPlayBtnClick: (props) => async () => {
      const { player } = props;

      try {
        if(!player) {
          props.setLoading(true);
          const newPlayer = await loadFile('/api/v1/track');
          duration = newPlayer.duration;
          props.setLoading(false);
          props.setPlayer(newPlayer);

          startedAt = Date.now();

          newPlayer.play(0);
          isPause = false;
          return props.setPlayState('stop');
        }
        startedAt = Date.now() - pausedAt;
        player.play(pausedAt / 1000);
        isPause = false
        return props.setPlayState('stop');
      } catch (e) {
        props.setLoading(false);
        console.log(e);
      }
    },
    onStopBtnClick: props => () => {
      const { player } = props;
      // to resume
      pausedAt = Date.now() - startedAt;
      player && player.stop();
      props.setPlayState('play');
      isPause = true
    },
    onVolumeChange: props => ({ max }) => props.setVolumeLevel(max),
  }),
  lifecycle({
    componentDidMount() {
      setInterval(() => {
        if(startedAt && !isPause) {
          const playbackTime = (Date.now() - startedAt) / 1000;
          const rate = parseInt((playbackTime * 100) / duration, 10);
          rate < 100 && this.props.setProgress(rate);
        }
      },1000)
    }
  })
)(Example2Container);
