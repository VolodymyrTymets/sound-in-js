import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRouter } from './router';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () =>
  <Router>
    <div className="container-fluid mt-2">
      <AppRouter />
    </div>
  </Router>;

export default App;
