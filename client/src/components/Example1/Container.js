import React from 'react';
import { compose, lifecycle, withState } from 'recompose';
import { Example1Container } from './Component';

export const Example1 = compose(
  withState('navigatorMicStream', 'setStream', null),
  lifecycle({
    componentDidMount() {

    }
  })
)(Example1Container);
