import React, { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import LoadingButton from '../../app/LoadingButton';
import { AdminPermissions, Permissions } from '../../app/permissions';
import { Protect } from '../../app/Protected';
import validationSchema from './userSchema';
import { addUser } from './usersSlice';
import { Form, Formik } from 'formik';
import { TextInput } from '../../app/form_helpers';
import PermissionsField from './PermissionsField';

function AddUserPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const showError = error !== null;
  return (
    <div>
      <h2>Add User</h2>
      {showError && (
        <Alert variant="danger">
          Failed to add user
          <div>{error}</div>
        </Alert>
      )}

      <Formik
        initialValues={{
          username: '',
          firstName: '',
          lastName: '',
          sessionTimeout: 10,
          permissions: [],
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          setError(null);
          try {
            const newUser = {
              ...values,
              permissions: Object.values(Permissions).filter((perm) =>
                values.permissions.includes(perm)
              ),
            };
            await dispatch(addUser(newUser)).unwrap();
            navigate('/users');
          } catch (error) {
            setError(error.message);
            setErrors(error.field_errors ?? {});
          }

          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form noValidate>
            <TextInput className="mb-3" name="firstName" label="First Name" />
            <TextInput className="mb-3" name="lastName" label="Last Name" />
            <TextInput className="mb-3" name="username" label="User Name" />
            <TextInput
              className="mb-3"
              name="sessionTimeout"
              label="Timeout (minutes)"
              type="number"
            />
            <PermissionsField className="mb-3" name="permissions" />

            <LoadingButton
              className="me-2"
              type="submit"
              isLoading={isSubmitting}
              loadingText="Saving.."
              text="Save"
            />
            <Button as={Link} to="/users">
              Cancel
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Protect(AddUserPage, AdminPermissions.ManageUsers);
