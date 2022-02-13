import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useField } from '../../app/hooks';
import { addSubscription, selectUnwatchedMoviesByMemberId } from './subscriptionsSlice';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoadingButton from '../../app/LoadingButton';
import Status from '../../app/status';
import { dateToInput } from '../../app/util';

function AddSubscriptionForm({ memberId }) {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(Status.Idle);
  const unwatchedMovies = useSelector((state) => selectUnwatchedMoviesByMemberId(state, memberId));
  const movie = useField('', '');
  const watchedAt = useField('date', dateToInput(new Date()));

  useEffect(() => {
    if (movie.value === '' && unwatchedMovies.length > 0) {
      movie.onChange({ target: { value: unwatchedMovies[0].id } });
    }
  }, [unwatchedMovies, movie]);

  const movieOptions = unwatchedMovies.map((movie) => (
    <option key={movie.id} value={movie.id}>
      {movie.name}
    </option>
  ));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(Status.Loading);
    try {
      const subscription = {
        movieId: movie.value,
        date: watchedAt.value,
      };
      await dispatch(addSubscription({ memberId, subscription })).unwrap();
      movie.onChange({ target: { value: '' } });
    } catch (error) {
      //TODO: notify
    }
    setStatus(Status.Idle);
  };

  const isLoading = status === Status.Loading;

  return (
    <div className="border px-2 mt-2">
      <Form onSubmit={handleSubmit}>
        <Row className="align-items-center my-3">
          <Col xs={5}>
            <Form.Select {...movie} aria-label="Select movie" size="sm">
              {movieOptions}
            </Form.Select>
          </Col>
          <Form.Group controlId="watchedAt" as={Col} xs="auto">
            <Form.Control {...watchedAt} size="sm" />
          </Form.Group>
          <Col xs="auto">
            <LoadingButton
              size="sm"
              type="submit"
              isLoading={isLoading}
              loadingText="Subscribing.."
              text="Subscribe"
            />
          </Col>
        </Row>
        <div className="d-flex gap-2 align-items-center"></div>
      </Form>
    </div>
  );
}

export default AddSubscriptionForm;
