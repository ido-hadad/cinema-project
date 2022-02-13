const jsonfile = require('jsonfile');

function clearUndefined(data) {
  if (!data) return {};
  const definedEntries = Object.entries(data).filter((item) => item[1] !== undefined);
  return Object.fromEntries(definedEntries);
}

class JsonDbCollection {
  constructor(fileName) {
    this.fileName = fileName;
    this.cache = null;
  }

  async shouldInitialize() {
    try {
      await this.getData();
    } catch (error) {
      // file doesn't exist
      if (error.errno === -4058) {
        return true;
      }
      throw error;
    }
    return false;
  }

  async init() {
    await jsonfile.writeFile(this.fileName, []);
    await jsonfile.readFile(this.fileName);
  }

  async reset() {
    await this.save([]);
  }

  async getData() {
    if (this.cache === null) this.cache = await jsonfile.readFile(this.fileName);
    return [...this.cache];
  }

  async save(data) {
    await jsonfile.writeFile(this.fileName, data);
    this.cache = data;
  }

  async create(obj) {
    const data = await this.getData();

    // const newData = data.filter((item) => item.id !== obj.id);
    const newItem = this.createItem(clearUndefined(this.objectToCollectionItem(obj)));
    data.push(newItem);

    await this.save(data);

    return newItem;
  }

  async update(updateData) {
    const data = await this.getData();
    const index = data.findIndex((item) => item.id === updateData.id);
    if (index === -1) return null;
    const updatedItem = this.updateItem(
      data[index],
      clearUndefined(this.objectToCollectionItem(updateData))
    );

    data[index] = updatedItem;
    await this.save(data);
    return updatedItem;
  }

  async remove(id) {
    const data = await this.getData();
    const newData = data.filter((item) => item.id !== id);
    await this.save(newData);
    return data.find((item) => item.id === id);
  }

  async get() {
    return this.getData();
  }

  async getById(id) {
    const data = await this.getData();
    return data.find((item) => item.id === id);
  }

  objectToCollectionItem(obj) {
    return { ...obj };
  }

  createItem(data) {
    return { ...data };
  }

  updateItem(doc, data) {
    return Object.assign(doc, data);
  }
}

module.exports = JsonDbCollection;
