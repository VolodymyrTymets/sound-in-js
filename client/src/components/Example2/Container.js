import React from 'react';
import { compose, lifecycle, withState, withHandlers, withProps } from 'recompose';
import axios from 'axios';
import { getAudioContext, play } from './utils';
import { Example2Container } from './Component';

var startedAt;
var pausedAt;
const audioBufferG = null

export const Example2 = compose(
  withState('volumeLevel', 'setVolumeLevel', 50),
  withState('progress', 'setProgress', 0),
  withState('playState', 'setPlayState', 'play'),
  withState('loading', 'setLoading', false),
  withState('audioBuffer', 'setAudioBuffer', null),

  // audio State
  withState('audioContext', 'setAudioContext', null),
  withState('audioSource', 'setAudioSource', null),
  withProps({
    isActive: (stateType, type) => stateType === type ? 'active' : '',
  }),
  withHandlers({
    onAudioProcess: props => (duration) => (event) => {
      const rate = parseInt((event.playbackTime * 100) / duration, 10);
      rate < 100 && props.setProgress(rate);
    }
  }),
  withHandlers({
    onPlayBtnClick: ({ playState, audioBuffer, onAudioProcess, audioSource, ...actions }) => () => {
      if(playState === 'play') {
        if (audioSource) {
          audioSource.start(0, pausedAt / 1000);
        } else {
          console.log(audioBuffer)
          // todo need to save  audioBuffer
          play(getAudioContext(), audioBuffer)
            .then(({scriptNode, source, duration}) => {
              scriptNode.onaudioprocess = onAudioProcess(duration);
              startedAt = Date.now();
              source.start();
              actions.setAudioSource(source);
              console.log(audioBuffer)
            })
            .catch(console.log)
        //}
      }
      if(playState === 'stop') {
        pausedAt = Date.now() - startedAt
        audioSource && audioSource.stop(0);
      }
      actions.setPlayState(playState === 'play' ? 'stop' : 'play');
    },
    onVolumeChange: props => ({ max }) => props.setVolumeLevel(max),
  }),
  lifecycle({
    componentDidMount() {
      this.props.setLoading(true);
      axios.get('/api/v1/track', {
        responseType: 'arraybuffer',
      })
        .then((response) => {
          this.props.setLoading(false);
          this.props.setAudioBuffer(response.data);
        })
        .catch((error) => {
          this.props.setLoading(false);
          console.log(error);
        });
    }
  })
)(Example2Container);
