import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useField } from '../../app/hooks';
import { Alert, Container } from 'react-bootstrap';
import { register } from './loginSlice';
import Status from '../../app/status';
import { Link, useNavigate } from 'react-router-dom';

import { Form, Formik } from 'formik';
import { TextInput } from '../../app/form_helpers';
import LoadingButton from '../../app/LoadingButton';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Required'),
  password: Yup.string().min(5, 'Password is too short').required('Required'),
  passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

function CreateAccountPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [status, setStatus] = useState(Status.Idle);
  const [error, setError] = useState(null);

  return (
    <Container>
      <div className="d-flex justify-content-center my-5">
        <div className="login-page w-100">
          {status === Status.Success && (
            <Alert variant="success">
              <Alert.Heading>User Registered!</Alert.Heading>
              You will be moved to the{' '}
              <Alert.Link to="/" as={Link}>
                login page
              </Alert.Link>
              ..
            </Alert>
          )}
          <h3 className="text-center">Register</h3>
          {status === Status.Failed && (
            <Alert variant="danger">
              {/* <Alert.Heading>Opps!</Alert.Heading> */}
              {error}
            </Alert>
          )}
          <Formik
            initialValues={{ username: '', password: '', passwordConfirmation: '' }}
            onSubmit={async (values) => {
              setError(null);
              try {
                setStatus(Status.Loading);
                await dispatch(
                  register({ username: values.username, password: values.password })
                ).unwrap();
                setStatus(Status.Success);
                setTimeout(() => navigate('/'), 4000);
              } catch (error) {
                setStatus(Status.Failed);
                setError(error.message);
              }
            }}
            validationSchema={validationSchema}
          >
            {() => (
              <Form>
                <TextInput className="mb-3" name="username" label="Username" />
                <TextInput className="mb-3" name="password" type="password" label="Password" />
                <TextInput
                  className="mb-3"
                  name="passwordConfirmation"
                  type="password"
                  label="Password confirmation"
                />
                <LoadingButton
                  type="submit"
                  loadingText="Registering.."
                  text="Register"
                  isLoading={status === Status.Loading}
                />
              </Form>
            )}
          </Formik>
          <p className="small mt-3">
            This page is for new users who received a username from the administrator and wish to
            create an account.
            <br /> If you already have an account, go to the{' '}
            <Link to="/" as={Link}>
              login page
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
}

export default CreateAccountPage;
