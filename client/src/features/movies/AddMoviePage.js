import React, { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import LoadingButton from '../../app/LoadingButton';
import { Permissions } from '../../app/permissions';
import { Protect } from '../../app/Protected';
import { dateToInput } from '../../app/util';
import validationSchema from './movieSchema';
import { addMovie } from './moviesSlice';
import { Form, Formik } from 'formik';
import { TextInput } from '../../app/form_helpers';

function AddMoviePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const showError = error !== null;
  return (
    <div>
      <h2>Add Movie</h2>
      {showError && (
        <Alert variant="danger">
          Failed to add movie
          <div>{error}</div>
        </Alert>
      )}
      <Formik
        initialValues={{ name: '', genres: '', image: '', premiered: dateToInput(new Date()) }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setError(null);
          try {
            const newMovie = {
              ...values,
              genres: values.genres
                .split(',')
                .map((s) => s.trim())
                .filter((s) => s),
            };
            await dispatch(addMovie(newMovie)).unwrap();
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
              loadingText="Saving.."
              text="Save"
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

export default Protect(AddMoviePage, Permissions.CreateMovie);
