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
import ListPage from './components/user/lists/ListPage';

import PrivateRoute from './components/PrivateRoute';
import { getUser } from './state/localStore';
import { getAllLocations } from './state/reducers/location/locationActions';

// TODO
// poista localstore käyttö ?? https://github.com/rt2zz/redux-persist
// state.user.user ??? sama locationissa
// tyypitykset yhteen paikkaan tai ainakin pois komponenteista ??? + extendaa niitä, nyt toistuu tyypitykset
// CRUD valmis niin eka Heroku?
// ks.Pin.jsx
// 404 page
// routeihin sama 401 iffeihin, nyt osassa throw new Error (tarvetta muuhunkin perkaamiseen,
// esim json/send, onko useriin tarvetta tallentaa locationit yms)
// Type User { Location[] vs ILocation[] vs Types.ObjectId ???? }
// deletoituuko listan kohteen myös listan deletoinnin yhteydessä?
// "Add location" oikealle vaikka plus ikoni, edit toiminnot ja poisto tänne? Nyt menee itelläkin nappulat sekaisin, back button

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
        <Switch>
          {/* private? Jos lista on public, niin sen tulee näkyä. Tee history.push() tjsp jos ei public ja ei oikea käyttäjä.
          List.createdBy ===  loggedUser.id */}
          <PrivateRoute path="/list/:id" component={ListPage} />
        </Switch>
      </Container>
    </>
  );
};
export default App;
