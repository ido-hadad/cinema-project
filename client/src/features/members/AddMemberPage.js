import React, { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import LoadingButton from '../../app/LoadingButton';
import { Permissions } from '../../app/permissions';
import { Protect } from '../../app/Protected';
import { addMember } from './membersSlice';

import { Form, Formik } from 'formik';
import validationSchema from './memberSchema';
import { TextInput } from '../../app/form_helpers';

function AddMemberPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const showError = error !== null;
  return (
    <div>
      <h2>Add Member</h2>
      {showError && (
        <Alert variant="danger">
          Failed to add member
          <div>{error}</div>
        </Alert>
      )}

      <Formik
        initialValues={{ name: '', email: '', city: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setError(null);
          try {
            const newMember = { ...values };
            await dispatch(addMember(newMember)).unwrap();
            navigate('/subs');
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
              name="email"
              label="Email"
              type="email"
              placeholder="user@example.com"
            />
            <TextInput className="mb-3" name="city" label="City" />

            <LoadingButton
              className="me-2"
              type="submit"
              isLoading={isSubmitting}
              loadingText="Saving.."
              text="Save"
            />
            <Button as={Link} to="/subs">
              Cancel
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Protect(AddMemberPage, Permissions.CreateSubscription);
