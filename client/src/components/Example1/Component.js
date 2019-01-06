import React from 'react';

export const Example1Contatiner = () =>
  <div>
    <h4>Example 1: <small className="text-muted">Audio element</small></h4>
    <audio controls>
      <source src="/api/v1/track" type="audio/mpeg" />
    </audio>
  </div>;