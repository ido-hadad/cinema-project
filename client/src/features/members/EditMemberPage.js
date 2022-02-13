import React, { useEffect, useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TextInput } from '../../app/form_helpers';

import LoadingButton from '../../app/LoadingButton';
import LoadingSpinner from '../../app/LoadingSpinner';
import PageLoadError from '../../app/PageLoadError';
import { Permissions } from '../../app/permissions';
import { Protect } from '../../app/Protected';
import Status from '../../app/status';
import validationSchema from './memberSchema';
import { fetchMembers, selectMemberById, updateMember } from './membersSlice';
import { Form, Formik } from 'formik';

function EditMemberPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const member = useSelector((state) => selectMemberById(state, id));
  const fetchStatus = useSelector((state) => state.members.status);
  const fetchError = useSelector((state) => state.members.error);

  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchMembers());
  }, []);

  if (fetchStatus === Status.Loading) return <LoadingSpinner />;
  if (fetchStatus === Status.Failed) return <PageLoadError error={fetchError.message} />;
  if (!member) return <div>Member not found</div>;

  const showError = error !== null;

  return (
    <div>
      <h2>Edit Member</h2>
      {showError && (
        <Alert variant="danger">
          Update failed
          <div>{error}</div>
        </Alert>
      )}

      <Formik
        initialValues={{ name: member.name, email: member.email, city: member.city }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setError(null);
          try {
            const updatedMember = { ...values };
            await dispatch(updateMember({ memberId: id, member: updatedMember })).unwrap();
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
              loadingText="Updating.."
              text="Update"
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

export default Protect(EditMemberPage, Permissions.UpdateSubscription);
