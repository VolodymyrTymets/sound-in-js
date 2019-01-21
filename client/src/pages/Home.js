import React from 'react';
import { Link } from 'react-router-dom'

const Home = () =>
  <div className="d-flex justify-content-center flex-column">
    <h1>Sound in js app exaples</h1>
    <div className="d-flex flex-column">
      <Link to="/example1" > Example1: </Link>
      <Link to="/example2" > Example2: </Link>
      <Link to="/example3" > Example3: </Link>
      <Link to="/example4" > Example4: </Link>
      <Link to="/example5" > Example5: </Link>
    </div>
  </div>;

export { Home };