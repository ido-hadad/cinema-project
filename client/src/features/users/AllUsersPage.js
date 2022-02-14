import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../../app/LoadingSpinner';
import PageLoadError from '../../app/PageLoadError';
import { AdminPermissions } from '../../app/permissions';
import { Protect } from '../../app/Protected';
import Status from '../../app/status';
import UserItem from './UserItem';
import { fetchUsers, selectAllUsers } from './usersSlice';

function AllUsersPage() {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const fetchStatus = useSelector((state) => state.users.status);
  const fetchError = useSelector((state) => state.users.error);
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (fetchStatus === Status.Idle) return null;
  if (fetchStatus === Status.Loading) return <LoadingSpinner />;
  if (fetchStatus === Status.Failed) {
    return <PageLoadError error={fetchError.message} />;
  }

  const renderedUsers = users.map((user) => <UserItem key={user.id} user={user} />);

  if (renderedUsers.length === 0)
    return (
      <div>
        No users <span className="fs-2">&#128532;</span>
      </div>
    );
  return <div>{renderedUsers}</div>;
}

export default Protect(AllUsersPage, AdminPermissions.ManageUsers);
