const JsonDbCollection = require('./JsonDbCollection');

class UserInfo extends JsonDbCollection {
  objectToCollectionItem(obj) {
    const { id, firstName, lastName, createdAt, sessionTimeout } = obj;
    return { id, firstName, lastName, createdAt, sessionTimeout };
  }

  createItem(data) {
    if (!data.id) throw Error('id is required to create item');
    const defaults = {
      firstName: '',
      lastName: '',
      createdAt: new Date().toISOString(),
      sessionTimeout: 10,
    };
    return this.updateItem({ ...defaults, id: data.id }, data);
  }

  updateItem(org, data) {
    const doc = { ...org };
    if (data.firstName !== undefined) doc.firstName = String(data.firstName);
    if (data.lastName !== undefined) doc.lastName = String(data.lastName);
    if (data.sessionTimeout !== undefined) {
      const timeout = parseInt(data.sessionTimeout);
      if (Number.isNaN(timeout)) throw new TypeError('timeout must be a number');

      doc.sessionTimeout = timeout;
    }

    return doc;
  }
}

module.exports = new UserInfo('db/users.json');
