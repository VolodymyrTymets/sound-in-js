import React from 'react';
import { compose, lifecycle, withState, withHandlers, withProps } from 'recompose';
import axios from 'axios';
import { Example2Container } from './Component';

export const Example2 = compose(
  withState('volumeLevel', 'setVolumeLevel', 50),
  withState('progress', 'setProgress', 0),
  withState('playState', 'setPlayState', 'stop'),
  withProps({
    isActive: (stateType, type) => stateType === type ? 'active' : '',
  }),
  withHandlers({
    onPlayBtnClick: ({ playState, setPlayState }) => () =>
      setPlayState(playState === 'play' ? 'stop' : 'play'),
    onVolumeChange: props => ({ max }) => props.setVolumeLevel(max),
  }),
  lifecycle({
    componentDidMount() {
      axios.get('/api/v1/track')
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  })
)(Example2Container);
