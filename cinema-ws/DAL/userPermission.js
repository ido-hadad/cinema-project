const JsonDbCollection = require('./JsonDbCollection');

class UserPermission extends JsonDbCollection {
  objectToCollectionItem(obj) {
    const { id, permissions } = obj;
    return { id, permissions };
  }

  createItem(data) {
    if (!data.id) throw Error('id is required to create item');
    const defaults = { permissions: [] };

    return this.updateItem({ ...defaults, id: data.id }, data);
  }

  updateItem(org, data) {
    const doc = { ...org };
    if (data.permissions) {
      if (!(data.permissions instanceof Array)) throw Error('permissions must be an array');

      doc.permissions = data.permissions;
    }

    return doc;
  }
}

module.exports = new UserPermission('db/permissions.json');
