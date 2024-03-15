import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import './style/App.css';
import Container from 'react-bootstrap/Container';

import Navigation from './components/nav/Navigation';
import Home from './components/Home';
import Register from './components/user/auth/Register';
import Login from './components/user/auth/Login';
import UserPage from './components/user/UserPage';
import ListPage from './components/lists/ListPage';
import PublicLists from './components/public/PublicLists';

import PrivateRoute from './components/PrivateRoute';
import { getUser } from './state/localStore';
import PublicListDetails from './components/public/PublicListDetails';
import NotFound from './NotFound';

const App: React.FC = () => {
  const [logged, setLogged] = useState<boolean>(false);
  const dispatch = useDispatch();
  console.log('App rendered');
  useEffect(() => {
    setLogged(!!getUser());
  }, [dispatch]);

  return (
    <>
      <Navigation logged={logged} setLogged={setLogged} />
      <Container id="mainContainer">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/register">
            <Register setLogged={setLogged} />
          </Route>
          <Route path="/login">
            <Login setLogged={setLogged} />
          </Route>
          <Route exact path="/public">
            <PublicLists />
          </Route>
          <Route exact path="/public/:id">
            <PublicListDetails />
          </Route>
          <PrivateRoute path="/userpage" component={UserPage} />
          <PrivateRoute path="/list/:id" component={ListPage} />
          <Route component={NotFound} />
        </Switch>
      </Container>
    </>
  );
};
export default App;
