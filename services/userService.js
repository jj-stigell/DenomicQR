import { executeQuery } from "../database/database.js";

/**
 * Add new user to the database.
 * @param {string} email 
 * @param {string} password crypted password
 */
const addUser = async (email, password) => {
  await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2)", email, password);
};

/**
 * Find existing user from the database based on the users email.
 * @param {string} email 
 * @returns user information
 */
const findUserByEmail = async (email) => {
  const result = await executeQuery("SELECT * FROM users WHERE email = $1", email);
  return result.rows;
};

/**
 * Check if user id matches the owner of the QR code.
 * @param {int} userId integer id of the user
 * @param {string} qrId string identifier for the QR code
 * @returns rows found (0 or 1)
 */
const isOwner = async (userId, qrId) => {
  const result = await executeQuery("SELECT * FROM qrCodes WHERE ownedBy = $1 AND qrId = $2;", userId, qrId);
  return result.rows;
};

export {
  addUser,
  findUserByEmail,
  isOwner,
};
