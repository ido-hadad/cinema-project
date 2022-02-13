export const Permissions = {
  ViewMovie: 'movie:view',
  CreateMovie: 'movie:create',
  DeleteMovie: 'movie:delete',
  UpdateMovie: 'movie:update',
  ViewSubscription: 'subs:view',
  CreateSubscription: 'subs:create',
  DeleteSubscription: 'subs:delete',
  UpdateSubscription: 'subs:update',
};

export const AdminPermissions = {
  ManageUsers: 'users',
};

export const PermissionsFriendly = {
  [Permissions.ViewMovie]: 'View Movies',
  [Permissions.CreateMovie]: 'Create Movies',
  [Permissions.DeleteMovie]: 'Delete Movies',
  [Permissions.UpdateMovie]: 'Edit Movies',
  [Permissions.ViewSubscription]: 'View Subscriptions',
  [Permissions.CreateSubscription]: 'Create Subscriptions',
  [Permissions.DeleteSubscription]: 'Delete Subscriptions',
  [Permissions.UpdateSubscription]: 'Edit Subscriptions',
};

export const toFriendly = (permission) => PermissionsFriendly[permission];

// checks if user has one of the specified permissions
export function hasPermission(user, ...permissions) {
  return permissions.some((permission) => {
    if (permission === AdminPermissions.ManageUsers) {
      return user.isAdmin;
    }

    return user && user.permissions.includes(permission);
  });
}
