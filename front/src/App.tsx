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

import PrivateRoute from './components/PrivateRoute';
import { getUser } from './state/localStore';
import { getAllLocations } from './state/reducers/location/locationActions';

// TODO
// poista localstore käyttö ?? https://github.com/rt2zz/redux-persist
// state.user.user ??? sama locationissa
// tyypitykset yhteen paikkaan tai ainakin pois komponenteista ??? + extendaa niitä, nyt toistuu tyypitykset
// Formeissa overlappia, kantsistko tehdä uudelleen käytettävät createlle ja editille ??? --> locationFromElements.ts
// edit/create kartat kanssa toistensa kaltaiset... Koklaa nostaa address ja pin statet ylös, jolloin sama karttakomponentti todnäk on ok
// ^ tällöin create/edit funktiot molemmat olisi userPagess, kuten delete
// delete route heittää UnhandledPromiseRejectionWarning??
// CRUD valmis niin eka Heroku?

const App: React.FC = () => {
  const [logged, setLogged] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setLogged(!!getUser());
    dispatch(getAllLocations());
  }, [dispatch]);

  return (
    <>
      <Navigation logged={logged} setLogged={setLogged} />
      <Container>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
        <Switch>
          <Route path="/register">
            <Register setLogged={setLogged} />
          </Route>
        </Switch>
        <Switch>
          <Route path="/login">
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
