import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootStore } from '../state/store';

const Home: React.FC = () => {
  const locations = useSelector((state: RootStore) => state.locations.locations);
  return (
    <Jumbotron className="mt-5 jumboHome">
      <p>This is home</p>
      {locations?.map((x) => (
        <p key={x._id}>{x.name}</p>
      ))}
    </Jumbotron>
  );
};

export default Home;
