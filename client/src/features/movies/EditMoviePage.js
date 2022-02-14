import React, { useEffect, useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

import LoadingButton from '../../app/LoadingButton';
import LoadingSpinner from '../../app/LoadingSpinner';
import { Permissions } from '../../app/permissions';
import { Protect } from '../../app/Protected';
import Status from '../../app/status';
import { dateToInput } from '../../app/util';
import { fetchMovies, selectMovieById, updateMovie } from './moviesSlice';
import PageLoadError from '../../app/PageLoadError';
import { TextInput } from '../../app/form_helpers';
import { Form, Formik } from 'formik';
import validationSchema from './movieSchema';

function EditMoviePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const movie = useSelector((state) => selectMovieById(state, id));
  const fetchError = useSelector((state) => state.movies.error);
  const fetchStatus = useSelector((state) => state.movies.status);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  if (fetchStatus === Status.Loading) return <LoadingSpinner />;
  if (fetchStatus === Status.Failed) return <PageLoadError error={fetchError.message} />;
  if (!movie) return <div>Movie not found</div>;

  const showError = error !== null;
  return (
    <div>
      <h2>Edit Movie</h2>
      {showError && (
        <Alert variant="danger">
          Update failed
          <div>{error}</div>
        </Alert>
      )}
      <Formik
        initialValues={{
          name: movie.name,
          genres: movie.genres.join(', '),
          image: movie.image,
          premiered: dateToInput(new Date(movie.premiered)),
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setError(null);
          try {
            const updatedMovie = {
              ...values,
              genres: values.genres
                .split(',')
                .map((s) => s.trim())
                .filter((s) => s),
            };
            await dispatch(updateMovie({ movieId: id, movie: updatedMovie })).unwrap();
            navigate('/movies');
          } catch (error) {
            setError(error.message);
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form noValidate>
            <TextInput className="mb-3" name="name" label="Name" />
            <TextInput
              className="mb-3"
              name="genres"
              label="Genres"
              placeholder="Comedy, Drama, etc.."
            />
            <TextInput
              className="mb-3"
              name="image"
              label="Image"
              placeholder="http://www.images.com/example.jpg"
            />
            <TextInput className="mb-3" name="premiered" type="date" label="Premiered at" />

            <LoadingButton
              className="me-2"
              type="submit"
              isLoading={isSubmitting}
              loadingText="Updating.."
              text="Update"
            />
            <Button as={Link} to="/movies">
              Cancel
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Protect(EditMoviePage, Permissions.UpdateMovie);
