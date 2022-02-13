import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteUser } from './usersSlice';

import Button from 'react-bootstrap/Button';
import { toFriendly } from '../../app/permissions';

const UserItem = ({ user }) => {
  const dispatch = useDispatch();
  const { id, firstName, lastName, username, sessionTimeout, createdAt, permissions } = user;

  return (
    <div className="movie-item border mb-2">
      <div className="d-flex">
        <div className="d-flex flex-column p-2">
          <h5>{`${firstName} ${lastName}`.trim()}</h5>
          <div>Username: {username}</div>
          <div>Created at: {new Date(createdAt).toLocaleDateString()}</div>
          <div>Timeout (minutes): {sessionTimeout}</div>
          <div>Permissions: {permissions.map(toFriendly).join(', ')}</div>
          <div className="d-flex mt-3">
            <Button className="me-2" size="sm" as={Link} to={`/users/edit/${id}`}>
              Edit
            </Button>
            <Button size="sm" onClick={() => dispatch(deleteUser(id))}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
