import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getUser } from '../state/localStore';

interface PrivateRouteProps {
  component: React.FC;
  path: string;
  exact?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = (props) => {
  const user = getUser();
  const { component, exact, path } = props;
  return user
    ? (<Route path={path} exact={exact} component={component} />)
    : (<Redirect to="/login" />);
};

export default PrivateRoute;
