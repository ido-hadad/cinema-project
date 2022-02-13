import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { deleteMember } from '../members/membersSlice';
import MemberSubscriptions from './MemberSubscriptions';
import { Permissions } from '../../app/permissions';
import Protected from '../../app/Protected';

const MemberItem = ({ member }) => {
  const dispatch = useDispatch();
  const { id, name, email, city } = member;
  return (
    <div className="member-item border p-3 mb-2">
      <h5>{name}</h5>
      <div>City: {city}</div>
      <div>Email: {email}</div>
      <div className="d-flex mb-3 mt-2">
        <Protected permission={Permissions.UpdateSubscription} hide>
          <Button className="me-2" size="sm" as={Link} to={`/subs/edit/${id}`}>
            Edit
          </Button>
        </Protected>
        <Protected permission={Permissions.DeleteSubscription} hide>
          <Button size="sm" onClick={() => dispatch(deleteMember(id))}>
            Delete
          </Button>
        </Protected>
      </div>
      <MemberSubscriptions memberId={id} />
    </div>
  );
};

export default MemberItem;
