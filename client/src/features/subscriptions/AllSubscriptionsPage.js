import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../../app/LoadingSpinner';
import PageLoadError from '../../app/PageLoadError';
import { Permissions } from '../../app/permissions';
import { Protect } from '../../app/Protected';
import Status from '../../app/status';
import { fetchMembers, selectAllMembers } from '../members/membersSlice';
import { fetchMovies } from '../movies/moviesSlice';
import MemberItem from './MemberItem';
import { fetchSubscriptions } from './subscriptionsSlice';

function AllSubscriptionsPage() {
  const dispatch = useDispatch();
  const members = useSelector(selectAllMembers);
  const fetchStatus = useSelector((state) => state.members.status);
  const fetchError = useSelector((state) => state.members.error);

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchMembers());
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  if (fetchStatus === Status.Idle) return null;
  if (fetchStatus === Status.Loading) return <LoadingSpinner />;
  if (fetchStatus === Status.Failed) return <PageLoadError error={fetchError.message} />;
  if (!members.length) return <div>Members list is empty.</div>;
  const renderedMembers = members.map((member) => <MemberItem key={member.id} member={member} />);

  return <div>{renderedMembers}</div>;
}

export default Protect(AllSubscriptionsPage, Permissions.ViewSubscription);
