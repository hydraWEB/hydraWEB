import './App.scss';
import React from 'react';
import { BrowserRouter, Router, Switch, Route } from 'react-router-dom';

import Guest from './page/Guest';
import User from './page/User';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <>
          <Switch>
            <Route path="/user">
              <User />
            </Route>
            <Route path="/guest">
                <Guest />
            </Route>
            <Route path="/">
                <Guest />
            </Route>
          </Switch>
      </>
    )
  }
}

export default App;
