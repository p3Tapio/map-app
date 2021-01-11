import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';

import './style/App.css';
import Container from 'react-bootstrap/Container';

import Navigation from './components/nav/Navigation';
import Home from './components/Home';
import Register from './components/user/auth/Register';
import Login from './components/user/auth/Login';
import UserPage from './components/user/UserPage';

import PrivateRoute from './components/PrivateRoute';
import { getUser } from './state/localStore';
// TODO
// errorit rekisteröinnissä ja loggauksessa
// poista localstore käyttö ?? https://github.com/rt2zz/redux-persist
// state.user.user ???

const App: React.FC = () => {
  const [logged, setLogged] = useState<boolean>(false);
  useEffect(() => { setLogged(!!getUser()); }, [logged]);

  return (
    <>
      <Navigation logged={logged} setLogged={setLogged} />
      <Container>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
        <Switch>
          <Route exact path="/register">
            <Register setLogged={setLogged} />
          </Route>
        </Switch>
        <Switch>
          <Route exact path="/login">
            <Login setLogged={setLogged} />
          </Route>
        </Switch>
        <Switch>
          <PrivateRoute path="/userpage" component={UserPage} />
        </Switch>
      </Container>
    </>
  );
};
export default App;
