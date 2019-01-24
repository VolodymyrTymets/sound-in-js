import React from 'react';

export const Example1Container = () =>
  <div>
    <h4>Example 1: <small className="text-muted">HTML Audio element</small></h4>
    <audio controls>
      <source src="/api/v1/track" type="audio/mpeg" />
    </audio>
    <h4 className="text-center mt-5">
      <a href="https://github.com/VolodymyrTymets/sound-in-js/tree/master/client/src/components/Example1" target='blank'>
        See code example here
      </a>
    </h4>
  </div>;