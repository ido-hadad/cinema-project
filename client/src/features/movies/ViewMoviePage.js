import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../../app/LoadingSpinner';
import PageLoadError from '../../app/PageLoadError';
import { Permissions } from '../../app/permissions';
import { Protect } from '../../app/Protected';
import Status from '../../app/status';
import { fetchMembers } from '../members/membersSlice';
import { fetchSubscriptions } from '../subscriptions/subscriptionsSlice';
import MovieItem from './MovieItem';
import { fetchMovies, selectMovieById } from './moviesSlice';

function ViewMoviePage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const movie = useSelector((state) => selectMovieById(state, id));
  const fetchStatus = useSelector((state) => state.movies.status);
  const fetchError = useSelector((state) => state.movies.error);
  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchSubscriptions());
    dispatch(fetchMembers());
  }, []);

  if (fetchStatus === Status.Loading) return <LoadingSpinner />;
  if (fetchStatus === Status.Failed) {
    return <PageLoadError error={fetchError.message} />;
  }

  if (!movie) return <div>Movie not found</div>;

  return <MovieItem movie={movie} />;
}

export default Protect(ViewMoviePage, Permissions.ViewMovie);
