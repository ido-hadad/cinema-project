import React, { useEffect } from 'react';
import { Field, useField } from 'formik';
import { Permissions } from '../../app/permissions';
import { Form } from 'react-bootstrap';

function PermissionsField({ name, ...props }) {
  const [field, meta, helpers] = useField(name);
  const { value: permissions } = meta;
  const { setValue } = helpers;

  useEffect(() => {
    if (
      !permissions.includes(Permissions.ViewMovie) &&
      [Permissions.CreateMovie, Permissions.UpdateMovie, Permissions.DeleteMovie].some((perm) =>
        permissions.includes(perm)
      )
    ) {
      setValue([...permissions, Permissions.ViewMovie]);
    }

    if (
      !permissions.includes(Permissions.ViewSubscription) &&
      [
        Permissions.CreateSubscription,
        Permissions.UpdateSubscription,
        Permissions.DeleteSubscription,
      ].some((perm) => permissions.includes(perm))
    ) {
      setValue([...permissions, Permissions.ViewSubscription]);
    }
  }, [permissions]);
  // const [val, setVal] = useState([]);

  return (
    <fieldset {...props}>
      <h5>Permissons</h5>

      <div className="d-flex">
        <div className="me-5">
          {' '}
          Movies:
          <Checkbox
            {...field}
            disabled={[
              Permissions.CreateMovie,
              Permissions.UpdateMovie,
              Permissions.DeleteMovie,
            ].some((perm) => permissions.includes(perm))}
            value={Permissions.ViewMovie}
          >
            View
          </Checkbox>
          <Checkbox {...field} value={Permissions.CreateMovie}>
            Create
          </Checkbox>
          <Checkbox {...field} value={Permissions.UpdateMovie}>
            Edit
          </Checkbox>
          <Checkbox {...field} value={Permissions.DeleteMovie}>
            Delete
          </Checkbox>
        </div>
        <div>
          {' '}
          Subscriptions:
          <Checkbox
            {...field}
            disabled={[
              Permissions.CreateSubscription,
              Permissions.UpdateSubscription,
              Permissions.DeleteSubscription,
            ].some((perm) => permissions.includes(perm))}
            value={Permissions.ViewSubscription}
          >
            View
          </Checkbox>
          <Checkbox {...field} value={Permissions.CreateSubscription}>
            Create
          </Checkbox>
          <Checkbox {...field} value={Permissions.UpdateSubscription}>
            Edit
          </Checkbox>
          <Checkbox {...field} value={Permissions.DeleteSubscription}>
            Delete
          </Checkbox>
        </div>
      </div>
    </fieldset>
  );
}

const Checkbox = ({ children, ...props }) => {
  return (
    <Form.Check className="" label={children} type="checkbox" {...props} as={Field}></Form.Check>
  );
};

export default PermissionsField;
