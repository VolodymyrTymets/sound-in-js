import React from 'react';
import { Switch, Route } from 'react-router';
import { Home, NoMatch, Example1Page, Example2Page } from './pages';

const AppRouter = () =>
  <Switch>
    <Route exact path="/" component={Home}/>
    <Route path="/example1" component={Example1Page}/>
    <Route path="/example2" component={Example2Page}/>
    <Route component={NoMatch}/>
  </Switch>;

export { AppRouter };