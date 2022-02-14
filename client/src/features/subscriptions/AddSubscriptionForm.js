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
  const movieSelect = useField();
  const watchedAt = useField('date', dateToInput(new Date()));

  useEffect(() => {
    if (movieSelect.value === '' && unwatchedMovies.length > 0) {
      movieSelect.setValue(unwatchedMovies[0].id);
    }
  }, [unwatchedMovies, movieSelect]);

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
        movieId: movieSelect.value,
        date: watchedAt.value,
      };
      await dispatch(addSubscription({ memberId, subscription })).unwrap();
      movieSelect.setValue('');
    } catch (error) {
      // skip
    }
    setStatus(Status.Idle);
  };

  const isLoading = status === Status.Loading;

  return (
    <div className="border px-2 mt-2">
      <Form onSubmit={handleSubmit}>
        <Row className="align-items-center my-3">
          <Col xs={5}>
            <Form.Select {...movieSelect} aria-label="Select movie" size="sm">
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
