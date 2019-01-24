import React from 'react';
import { Link } from 'react-router-dom'

const Home = () =>
  <div className="d-flex justify-content-center flex-column">
    <h1>Sound in js app exaples</h1>
    <div className="d-flex flex-column">
      <h3 className="p-1">
        <Link to="/example1" >Example1:
          <span className="small">HTML Audio element</span>
        </Link>
      </h3>
      <h3 className="p-1">
        <Link to="/example2" > Example2:
          <span className="small">Custom audio element</span>
        </Link>
      </h3>
      <h3 className="p-1">
        <Link to="/example3" > Example3:
          <span className="small">Frequency oscillator</span>
        </Link>
      </h3>
      <h3 className="p-1">
        <Link to="/example4" > Example4:
          <span className="small"> Sound visualization</span>
        </Link>
      </h3>
      <h3 className="p-1">
        <Link to="/example5" > Example5:
          <span className="small">Sound Streaming</span>
        </Link>
      </h3>
    </div>
  </div>;

export { Home };