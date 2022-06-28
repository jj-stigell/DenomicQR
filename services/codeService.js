import { executeQuery } from "../database/database.js";

const addNewCode = async (qrId, ownedBy, qrCode, linksTo, comment) => {
  await executeQuery("INSERT INTO QRcodes (qrId, ownedBy, qrCode, linksTo, comment) VALUES ($1, $2, $3, $4, $5);", qrId, ownedBy, qrCode, linksTo, comment);
  await executeQuery("INSERT INTO editHistory (qrId, linksTo, comment) VALUES ($1, $2, $3);", qrId, linksTo, comment);
};

/** Returns the link and QR code id with an id 'qrId' */
const getLink = async (qrId) => {
  const res = await executeQuery("SELECT linksto, qrid FROM QRcodes WHERE qrId = $1;", qrId);
  return res.rows;
}

/** Returns all the QR codes created by that particular user */
const getUserCodes = async (ownedBy) => {
    const res = await executeQuery("SELECT * FROM QRcodes WHERE ownedBy = $1;", ownedBy);
    return res.rows;
};

/** Deletes QR code with an id 'qrId' */
const deleteCode = async (qrId) => {
  await executeQuery("DELETE FROM QRcodes WHERE qrId = $1;", qrId);
};

/** Returns QR code with an id 'qrId' */
const getCode = async (qrId) => {
  const res = await executeQuery("SELECT * FROM QRcodes WHERE qrId = $1;", qrId);
  return res.rows[0];
};

/** Updates the url that the QR code is redirecting to */
const updateUrl = async (qrId, url) => {
  const res = await executeQuery("UPDATE QRcodes SET linksTo = $1 WHERE qrId = $2;", url, qrId);
  return res.rows;
};

/** Updates the comment of the QR code with an id 'qrId' */
const updateComment = async (qrId, comment) => {
  const res = await executeQuery("UPDATE QRcodes SET comment = $1 WHERE qrId = $2;", comment, qrId);
  return res.rows;
};

/** Updates url and comment of QR code with an id 'qrId' */
const updateUrlAndComment = async (qrId, url, comment) => {
  const res = await executeQuery("UPDATE QRcodes SET linksTo = $1, comment = $2 WHERE qrId = $3;", url, comment, qrId);
  return res.rows;
};

/** Adds one view to the QR codes redirect history, also increments QR codes vies by one */
const addView = async (qrId) => {
  await executeQuery("INSERT INTO viewsHistory (qrId) VALUES ($1);", qrId);
  await executeQuery("UPDATE QRcodes SET views = views + 1 WHERE qrId = $1;", qrId);
};

/** Returns the redirect history of the QR code, returns last 20 redirections */
const getRedirectHistory = async (qrId) => {
  const res = await executeQuery("SELECT id, viewedat FROM viewsHistory WHERE qrId = $1 ORDER BY viewedAt DESC LIMIT 20;", qrId);
  return res.rows;
};

/** Returns the edit history of the QR code with an id 'qrId' */
const getEditHistory = async (qrId) => {
  const res = await executeQuery("SELECT id, linksto, comment, fromdate, todate FROM edithistory WHERE qrId = $1 ORDER BY fromdate DESC LIMIT 20;", qrId);
  return res.rows;
};

/** 
 * Updates the edit history of The QR code. Sets the lastest 
 * edits toDate to NOW() and Inserts a new row to the edit 
 * history which represents the current state of the QR code.
 */
const updateEditHistory = async (qrId, url, comment) => {
  await executeQuery(
  `UPDATE edithistory SET todate = NOW() WHERE qrid = $1 AND
  fromdate = (select max(fromdate) from edithistory WHERE qrid = $1);`,
  qrId);
  await executeQuery("INSERT INTO editHistory (qrId, linksTo, comment) VALUES ($1, $2, $3);", qrId, url, comment);
  await executeQuery("UPDATE QRcodes SET updated = NOW() WHERE qrId = $1;", qrId);
};

export {
  addNewCode,
  getLink,
  getUserCodes,
  deleteCode,
  getCode,
  updateUrl,
  updateComment,
  updateUrlAndComment,
  addView,
  getRedirectHistory,
  getEditHistory,
  updateEditHistory,
};
