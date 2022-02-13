import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMovieById } from '../movies/moviesSlice';
import { removeSubscription, selectSubscriptionById } from './subscriptionsSlice';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import AddSubscriptionForm from './AddSubscriptionForm';
import { Placeholder } from 'react-bootstrap';
import Protected from '../../app/Protected';
import { Permissions } from '../../app/permissions';
import { Link } from 'react-router-dom';
import LoadingButton from '../../app/LoadingButton';

function MemberSubscriptions({ memberId }) {
  const subs = useSelector((state) => selectSubscriptionById(state, memberId));
  const [open, setOpen] = useState(false);
  const renderedSubs = (subs?.movies ?? []).map((sub) => {
    return (
      <li key={sub.movieId}>
        <MemberSubscriptionItem memberId={memberId} sub={sub} />
      </li>
    );
  });

  return (
    <div>
      {!renderedSubs.length ? null : (
        <>
          <h6>Subscriptions</h6>
          <ul className="member-subs">{renderedSubs}</ul>
        </>
      )}
      <Protected permission={Permissions.CreateSubscription} hide>
        <Button
          size="sm"
          onClick={() => setOpen(!open)}
          aria-controls="add-sub"
          aria-expanded={open}
        >
          Add Subscription
        </Button>
        <Collapse in={open}>
          <div id="add-sub">
            <AddSubscriptionForm memberId={memberId} />
          </div>
        </Collapse>
      </Protected>
    </div>
  );
}

const MemberSubscriptionItem = ({ memberId, sub }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => (mountedRef.current = false);
  }, []);

  const handleRemoveSub = async () => {
    setIsLoading(true);
    await dispatch(removeSubscription({ memberId, movieId: sub.movieId }));
    if (!mountedRef.current) return;
    setIsLoading(false);
  };

  return (
    <div className="d-flex align-items-center">
      <div className="text-truncate me-3" style={{ flexBasis: '220px' }}>
        <MovieName movieId={sub.movieId} />
      </div>
      <div className="col-auto me-3">
        {new Date(sub.date).toLocaleDateString(undefined, {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        })}
      </div>
      <LoadingButton
        className={`remove-btn p-0 fs-5 ${isLoading ? 'opacity-100 text-black' : ''}`}
        isLoading={isLoading}
        onClick={() => handleRemoveSub()}
      >
        <i className="fa fa-minus-circle" aria-hidden="true"></i>
      </LoadingButton>
    </div>
  );
};

const MovieName = ({ movieId }) => {
  const movie = useSelector((state) => selectMovieById(state, movieId));

  return (
    <span>
      {movie ? (
        <Link to={`/movies/${movieId}`}>{movie.name}</Link>
      ) : (
        <Placeholder style={{ width: '80px' }} />
      )}
    </span>
  );
};

export default MemberSubscriptions;
