import React, { useEffect, useState } from 'react';
import { Formik, Field, useField, useFormikContext } from 'formik';
import { Permissions } from '../../app/permissions';
import { ToggleButton, ToggleButtonGroup, FormCheck, Form } from 'react-bootstrap';

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
      {/* <ToggleButtonGroup type="checkbox" onChange={setValue}>
        {' '}
        Movies:
        <ToggleButton
          variant="outline-primary"
          id="btn-1"
          disabled={[
            Permissions.CreateMovie,
            Permissions.UpdateMovie,
            Permissions.DeleteMovie,
          ].some((perm) => permissions.includes(perm))}
          value={Permissions.ViewMovie}
        >
          View
        </ToggleButton>
        <ToggleButton variant="outline-primary" id="btn-2" value={Permissions.CreateMovie}>
          Create
        </ToggleButton>
        <ToggleButton variant="outline-primary" id="btn-3" value={Permissions.UpdateMovie}>
          Edit
        </ToggleButton>
        <ToggleButton variant="outline-primary" id="btn-4" value={Permissions.DeleteMovie}>
          Delete
        </ToggleButton>
        <div className="d-block"></div>
        Movies:
        <ToggleButton
          className="d-block"
          variant="outline-primary"
          id="btn-1"
          disabled={[
            Permissions.CreateMovie,
            Permissions.UpdateMovie,
            Permissions.DeleteMovie,
          ].some((perm) => permissions.includes(perm))}
          value={Permissions.ViewMovie}
        >
          View
        </ToggleButton>
        <ToggleButton variant="outline-primary" id="btn-2" value={Permissions.CreateMovie}>
          Create
        </ToggleButton>
        <ToggleButton variant="outline-primary" id="btn-3" value={Permissions.UpdateMovie}>
          Edit
        </ToggleButton>
        <ToggleButton variant="outline-primary" id="btn-4" value={Permissions.DeleteMovie}>
          Delete
        </ToggleButton>
      </ToggleButtonGroup> */}

      <div className="d-flex">
        <div className="me-5">
          {' '}
          Movies:
          <MyCheckbox
            {...field}
            disabled={[
              Permissions.CreateMovie,
              Permissions.UpdateMovie,
              Permissions.DeleteMovie,
            ].some((perm) => permissions.includes(perm))}
            value={Permissions.ViewMovie}
          >
            View
          </MyCheckbox>
          <MyCheckbox {...field} value={Permissions.CreateMovie}>
            Create
          </MyCheckbox>
          <MyCheckbox {...field} value={Permissions.UpdateMovie}>
            Edit
          </MyCheckbox>
          <MyCheckbox {...field} value={Permissions.DeleteMovie}>
            Delete
          </MyCheckbox>
        </div>
        <div>
          {' '}
          Subscriptions:
          <MyCheckbox
            {...field}
            disabled={[
              Permissions.CreateSubscription,
              Permissions.UpdateSubscription,
              Permissions.DeleteSubscription,
            ].some((perm) => permissions.includes(perm))}
            value={Permissions.ViewSubscription}
          >
            View
          </MyCheckbox>
          <MyCheckbox {...field} value={Permissions.CreateSubscription}>
            Create
          </MyCheckbox>
          <MyCheckbox {...field} value={Permissions.UpdateSubscription}>
            Edit
          </MyCheckbox>
          <MyCheckbox {...field} value={Permissions.DeleteSubscription}>
            Delete
          </MyCheckbox>
        </div>
      </div>
      {/* <div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">
        <input type="checkbox" class="btn-check" id="btncheck1" autocomplete="off" />
        <label class="btn btn-outline-primary" for="btncheck1">
          Checkbox 1
        </label>

        <input type="checkbox" class="btn-check" id="btncheck2" autocomplete="off" />
        <label class="btn btn-outline-primary" for="btncheck2">
          Checkbox 2
        </label>

        <input type="checkbox" class="btn-check" id="btncheck3" autocomplete="off" />
        <label class="btn btn-outline-primary" for="btncheck3">
          Checkbox 3
        </label>
      </div> */}
    </fieldset>
  );
}

const MyCheckbox = ({ children, ...props }) => {
  return (
    <Form.Check className="" label={children} type="checkbox" {...props} as={Field}></Form.Check>
  );
};

const MyCheckbox2 = ({ children, ...props }) => {
  return <Form.Check className="" label={children} type="checkbox" {...props}></Form.Check>;
};

export default PermissionsField;
