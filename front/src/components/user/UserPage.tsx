import React, { useState } from 'react';

import {
  Container, Button,
} from 'react-bootstrap';
import { getUser } from '../../state/localStore';
import CreateNewModal from './create/CreateNewModal';

const UserPage: React.FC = () => {
  const user = getUser();
  const [show, setShow] = useState(false);

  const handleCreateNewClick = (): void => {
    setShow(true);
  };

  if (!user) return null;
  return (
    <>
      <Container className="mt-5">
        <h4>
          Hi,
          {' '}
          {user.data.username}
          !
        </h4>
        <p>
          Below you can see locations that you have added to the map.
          You can create a new one by clicking the create new button!
        </p>
        <Button onClick={handleCreateNewClick} size="sm" variant="outline-secondary">Create New</Button>
        <hr />
      </Container>
      <CreateNewModal setShow={setShow} show={show} />
    </>
  );
};

export default UserPage;
