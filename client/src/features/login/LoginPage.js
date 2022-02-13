import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Alert, Container } from 'react-bootstrap';
import { login } from './loginSlice';
import { Link } from 'react-router-dom';

import { Form, Formik } from 'formik';
import { TextInput } from '../../app/form_helpers';
import LoadingButton from '../../app/LoadingButton';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

function LoginPage() {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  return (
    <Container>
      <div className="d-flex justify-content-center my-5">
        <div className="login-page w-100">
          <h3 className="text-center">Sign in</h3>
          {error !== null && (
            <Alert variant="danger">
              {/* <Alert.Heading>Login Failed</Alert.Heading> */}
              {error}
            </Alert>
          )}
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setError(null);
              try {
                await dispatch(login({ ...values })).unwrap();
              } catch (error) {
                setError(error.message);
              }
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => {
              return (
                <Form>
                  <TextInput
                    className="mb-3"
                    name="username"
                    label="Username"
                    autoComplete="username"
                  />
                  <TextInput
                    className="mb-3"
                    type="password"
                    name="password"
                    label="Password"
                    autoComplete="current-password"
                  />
                  <LoadingButton
                    type="submit"
                    isLoading={isSubmitting}
                    text="Login"
                    loadingText="Hold on.."
                  />
                </Form>
              );
            }}
          </Formik>

          <div className="mt-3">
            if you don't have an account, go ahead and <Link to="/register">register</Link>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default LoginPage;
