import React from 'react';
import { getUser } from '../../state/localStore';

const UserPage: React.FC = () => {
  const user = getUser();

  if (!user) return null;
  return (
    <div>
      <p>
        User
        {user.data.username}
      </p>
    </div>
  );
};

export default UserPage;
