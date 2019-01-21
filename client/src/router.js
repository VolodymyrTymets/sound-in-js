import React from 'react';
import { Switch, Route } from 'react-router';
import { Home, NoMatch, Example1Page, Example2Page, Example3Page, Example4Page, Example5Page } from './pages';

const AppRouter = () =>
  <Switch>
    <Route exact path="/" component={Home}/>
    <Route path="/example1" component={Example1Page}/>
    <Route path="/example2" component={Example2Page}/>
    <Route path="/example3" component={Example3Page}/>
    <Route path="/example4" component={Example4Page}/>
    <Route path="/example5" component={Example5Page}/>

    <Route component={NoMatch}/>
  </Switch>;

export { AppRouter };
