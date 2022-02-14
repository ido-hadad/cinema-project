import React, { useEffect } from 'react';
import { Form, Pagination } from 'react-bootstrap';

import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../../app/LoadingSpinner';
import PageLoadError from '../../app/PageLoadError';
import { Permissions } from '../../app/permissions';
import { Protect } from '../../app/Protected';
import ScrollTopButton from '../../app/ScrollTopButton';
import Status from '../../app/status';
import {
  movieFilterChanged,
  moviePageChanged,
  moviePageSizeChange,
  selectFilteredMoviesPage,
  selectMovieFilter,
  selectMovieFilterPageSize,
} from '../filters/filtersSlice';
import { fetchMembers } from '../members/membersSlice';
import { fetchSubscriptions } from '../subscriptions/subscriptionsSlice';
import MovieFilterForm from './MovieFilterForm';
import MovieItem from './MovieItem';
import { fetchMovies } from './moviesSlice';

function AllMoviesPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { movies, currentPage, totalPages, pageSize } = useSelector(selectFilteredMoviesPage);
  // const foundTotal = useSelector(selectFilteredMoviesTotal);
  const movieFilter = useSelector(selectMovieFilter);
  const fetchStatus = useSelector((state) => state.movies.status);
  const fetchError = useSelector((state) => state.movies.error);

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchMembers());
    dispatch(fetchSubscriptions());

    dispatch(movieFilterChanged(searchParams.get('q') ?? ''));
    dispatch(moviePageSizeChange(searchParams.get('size')));
    dispatch(moviePageChanged(searchParams.get('page')));
  }, []);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    params.q = movieFilter;
    params.page = currentPage;
    params.size = pageSize;
    if (currentPage === 1) delete params.page;
    if (!movieFilter) delete params.q;

    setSearchParams(params);
  }, [movieFilter, pageSize, currentPage]);

  if (fetchStatus === Status.Idle) return null;
  if (fetchStatus === Status.Loading) return <LoadingSpinner />;
  if (fetchStatus === Status.Failed) {
    return <PageLoadError error={fetchError.message} />;
  }

  const selectPage = (page) => {
    dispatch(moviePageChanged(page));
  };

  const renderedMovies = movies.map((movie) => <MovieItem key={movie.id} movie={movie} />);

  return (
    <>
      <div className="d-flex px-1 py-2 my-1 sticky-nav justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <MovieFilterForm className="me-2" />
          {/* Found {foundTotal} */}
        </div>
        <PageList
          className="my-0 me-2"
          length={totalPages}
          current={currentPage}
          onClick={selectPage}
        />
        <div className="d-flex align-items-center">
          Display
          <div className="ms-2 col-auto">
            <MoviePageSizeForm />
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center"></div>
      <div className="position-relative">
        <div className="cover-shadow bg-light"></div>
        {movies.length ? (
          renderedMovies
        ) : (
          <div>
            No results <span className="fs-2">&#128532;</span>
          </div>
        )}
      </div>
      {/* <div className="d-flex justify-content-center">
        <PageList
          length={totalPages}
          current={currentPage}
          onClick={(page) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            dispatch(moviePageChanged(page));
          }}
        />
      </div> */}
      <ScrollTopButton />
    </>
  );
}

const PageList = ({ length, current, onClick, ...props }) => {
  if (length <= 0) return null;

  const diff = 2;

  const pivot = current > length ? length : current < 1 ? 1 : current;

  let start = Math.max(pivot - diff, 1);
  let end = Math.min(pivot + diff + (pivot - diff < 1 ? diff - pivot + 1 : 0), length);
  // console.log({ length, current, start, end, pivot });

  const adjacentPages = Array(end - start + 1)
    .fill(start)
    .map((v, i) => (
      <Pagination.Item key={v + i} active={current === v + i} onClick={() => onClick(v + i)}>
        {v + i}
      </Pagination.Item>
    ));
  return (
    <Pagination {...props}>
      {current > 1 && <Pagination.First onClick={() => onClick(1)} />}
      {adjacentPages}
      {current < length && <Pagination.Last onClick={() => onClick(length)} />}
    </Pagination>
  );
};

const MoviePageSizeForm = ({ ...props }) => {
  const dispatch = useDispatch();
  const pageSize = useSelector(selectMovieFilterPageSize);

  return (
    <Form.Select
      {...props}
      onChange={(e) => {
        dispatch(moviePageSizeChange(e.target.value));
      }}
      value={pageSize}
    >
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={30}>30</option>
    </Form.Select>
  );
};

export default Protect(AllMoviesPage, Permissions.ViewMovie);
