import { MongoClient } from "mongodb";

import config from "../config/index.js";

let database;

export const connectToDatabase = async () => {
  const options = { useUnifiedTopology: true, useNewUrlParser: true };
  const client = new MongoClient(config.dbUrl, options);
  await client.connect();
  database = client.db(config.dbName);
};

export const accessDatabase = () => database;
