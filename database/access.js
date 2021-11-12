import { ObjectId } from "mongodb";

import { accessDatabase } from "./connect.js";

const setDb = (collection) => {
  return accessDatabase().collection(collection);
};

const setIdQuery = (id) => {
  return { _id: new ObjectId(id) };
};

const setOptions = (projectionFields, sortOptions) => {
  const options = { projection: {}, sort: sortOptions };
  for (let field of projectionFields) {
    options.projection[field] = 1;
  }
  return options;
};

export default {
  async create(collection, data) {
    const db = setDb(collection);
    const isArray = Array.isArray(data);
    return isArray ? await db.insertMany(data) : await db.insertOne(data);
  },
  async findById(collection, id, projectionFields = [], sortOptions = {}) {
    const db = setDb(collection);
    const query = setIdQuery(id);
    const options = setOptions(projectionFields, sortOptions);
    return await db.findOne(query, options);
  },
  async find(collection, query, projectionFields = [], sortOptions = {}) {
    const db = setDb(collection);
    const options = setOptions(projectionFields, sortOptions);
    return await db.find(query, options).toArray();
  },
  async updateById(collection, id, updateDocument) {
    const db = setDb(collection);
    const filter = setIdQuery(id);
    const update = { $set: updateDocument };
    return await db.updateOne(filter, update);
  },
  async update(collection, filter, updateDocument) {
    const db = setDb(collection);
    const update = { $set: updateDocument };
    return await db.updateMany(filter, update);
  },
  async deleteById(collection, id) {
    const db = setDb(collection);
    const filter = setIdQuery(id);
    return await db.deleteOne(filter);
  },
  async delete(collection, filter) {
    const db = setDb(collection);
    return await db.deleteMany(filter);
  },
};