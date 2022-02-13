import React from 'react';
import { useSelector } from 'react-redux';

import { selectCurrentUser } from '../features/login/loginSlice';
import { hasPermission } from './permissions';

function Protected({ children, permission, ...props }) {
  const user = useSelector(selectCurrentUser);
  const alt = 'hide' in props && props.hide !== false ? null : <UnauthorizedPage />;
  return hasPermission(user, permission) ? children : alt;
}

export const Protect =
  (Component, permission, hide = false) =>
  (props) => {
    return (
      <Protected permission={permission} hide={hide}>
        <Component {...props} />
      </Protected>
    );
  };

function UnauthorizedPage() {
  return <div>You do not have the required permission to view this page.</div>;
}

export default Protected;
