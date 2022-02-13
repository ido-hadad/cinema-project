import { useState } from 'react';
import { Permissions, toFriendly } from '../../app/permissions';

import { Form } from 'react-bootstrap';

const permsToMap = (permArray = []) =>
  Object.fromEntries(Object.values(Permissions).map((perm) => [perm, permArray.includes(perm)]));

const defaultPermissions = permsToMap(Object.values(Permissions));

export const usePermissionsForm = (initialValues) => {
  const initialPermissions = !initialValues ? defaultPermissions : permsToMap(initialValues);
  const [permissions, setPermissions] = useState(initialPermissions);
  const getValues = () => Object.values(Permissions).filter((perm) => permissions[perm]);
  const setValues = (permArray) => setPermissions(permsToMap(permArray));

  const hook = { permissions, setPermissions, getValues, setValues };
  Object.defineProperty(hook, 'getValues', { enumerable: false });
  Object.defineProperty(hook, 'setValues', { enumerable: false });
  return hook;
};

export const PermissionsForm = ({ permissions, setPermissions, ...props }) => {
  const handleChecked = ({ target }) => {
    const { checked, value: perm } = target;
    const perms = { ...permissions };

    switch (perm) {
      case Permissions.CreateMovie:
      case Permissions.UpdateMovie:
      case Permissions.DeleteMovie:
        if (checked) {
          perms[Permissions.ViewMovie] = true;
        }
        break;
      case Permissions.CreateSubscription:
      case Permissions.UpdateSubscription:
      case Permissions.DeleteSubscription:
        if (checked) {
          perms[Permissions.ViewSubscription] = true;
        }
        break;
      default:
        break;
    }
    perms[perm] = checked;
    setPermissions(perms);
  };

  const isDisabled = (perm) => {
    if (
      perm === Permissions.ViewMovie &&
      [Permissions.CreateMovie, Permissions.DeleteMovie, Permissions.UpdateMovie].some(
        (p) => permissions[p]
      )
    )
      return true;
    if (
      perm === Permissions.ViewSubscription &&
      [
        Permissions.CreateSubscription,
        Permissions.DeleteSubscription,
        Permissions.UpdateSubscription,
      ].some((p) => permissions[p])
    ) {
      return true;
    }
    return false;
  };

  const renderdCheckboxes = Object.values(Permissions).map((val) => (
    <Form.Check
      key={val}
      disabled={isDisabled(val)}
      checked={permissions[val]}
      onChange={handleChecked}
      type="checkbox"
      label={toFriendly(val)}
      value={val}
      id={val}
    />
  ));

  return <Form.Group {...props}>{renderdCheckboxes}</Form.Group>;
};
