import { Pool } from "../deps.js";
import creds from '../config/database/creds.js';
import { concurrentConnections } from '../config/settings.js';

const connectionPool = new Pool({
  hostname: creds.hostname,
  database: creds.database,
  user: creds.user,
  password: creds.password,
  port: creds.port,
}, concurrentConnections);

const executeQuery = async (query, ...args) => {
  const response = {};
  let client;

  try {
    client = await connectionPool.connect();
    const result = await client.queryObject(query, ...args);
    if (result.rows) {
      response.rows = result.rows;
    }
  } catch (e) {
    console.log(e);
    response.error = e;
  } finally {
    try {
      await client.release();
    } catch (e) {
      console.log(e);
    }
  }
  return response;
};

export { executeQuery };
