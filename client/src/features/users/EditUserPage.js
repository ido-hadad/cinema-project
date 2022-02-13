import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useField } from '../../app/hooks';
import Status from '../../app/status';
import { PermissionsForm, usePermissionsForm } from './UserPermissionsForm';
import { fetchUsers, selectUserById, updateUser } from './usersSlice';
import { Button, Alert } from 'react-bootstrap';
import LoadingButton from '../../app/LoadingButton';
import { AdminPermissions, Permissions } from '../../app/permissions';
import { Protect } from '../../app/Protected';
import LoadingSpinner from '../../app/LoadingSpinner';
import PageLoadError from '../../app/PageLoadError';
import { TextInput } from '../../app/form_helpers';
import PermissionsField from './PermissionsField';
import validationSchema from './userSchema';
import { Form, Formik } from 'formik';

function EditUserPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state) => selectUserById(state, id));
  const fetchStatus = useSelector((state) => state.users.status);
  const fetchError = useSelector((state) => state.users.error);

  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (fetchStatus === Status.Loading) return <LoadingSpinner />;
  if (fetchStatus === Status.Failed) return <PageLoadError error={fetchError.message} />;
  if (!user) return <div>User not found</div>;

  const showError = error !== null;

  return (
    <div>
      <h2>Edit User</h2>
      {showError && (
        <Alert variant="danger">
          Update failed
          <div>{error}</div>
        </Alert>
      )}
      <Formik
        initialValues={{
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          sessionTimeout: user.sessionTimeout,
          permissions: user.permissions,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          setError(null);
          try {
            const updatedUser = {
              ...values,
              permissions: Object.values(Permissions).filter((perm) =>
                values.permissions.includes(perm)
              ),
            };

            await dispatch(updateUser({ userId: id, user: updatedUser })).unwrap();
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
              loadingText="Updating.."
              text="Update"
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

export default Protect(EditUserPage, AdminPermissions.ManageUsers);
