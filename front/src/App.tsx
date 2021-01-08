import React from 'react';
import { Switch, Route } from 'react-router-dom';

import './style/App.css';
import Container from 'react-bootstrap/Container';

import Navigation from './components/nav/Navigation';
import Home from './components/Home';
import Register from './components/user/Register';

const App: React.FC = () => (
  <>
    <Navigation />
    <Container>
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
      <Switch>
        <Route exact path="/register" component={Register} />
      </Switch>
    </Container>
  </>
);

export default App;
