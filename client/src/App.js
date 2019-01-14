import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRouter } from './router';
import 'bootstrap-material-design/dist/css/bootstrap-material-design.min.css';

const App = () =>
  <Router>
    <div className="container-fluid mt-2">
      <AppRouter />
    </div>
  </Router>;

export default App;
