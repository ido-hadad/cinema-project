import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../../app/LoadingSpinner';
import PageLoadError from '../../app/PageLoadError';
import { Permissions } from '../../app/permissions';
import { Protect } from '../../app/Protected';
import Status from '../../app/status';
import { fetchMovies } from '../movies/moviesSlice';
import MemberItem from '../subscriptions/MemberItem';
import { fetchSubscriptions } from '../subscriptions/subscriptionsSlice';

import { fetchMembers, selectMemberById } from './membersSlice';

function ViewMemberPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const member = useSelector((state) => selectMemberById(state, id));
  const fetchStatus = useSelector((state) => state.members.status);
  const fetchError = useSelector((state) => state.members.error);
  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchMembers());
    dispatch(fetchSubscriptions());
  }, []);

  if (fetchStatus === Status.Loading) return <LoadingSpinner />;
  if (fetchStatus === Status.Failed) {
    return <PageLoadError error={fetchError.message} />;
  }

  if (!member) return <div>Member not found</div>;

  return <MemberItem member={member} />;
}

export default Protect(ViewMemberPage, Permissions.ViewSubscription);
