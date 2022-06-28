import * as codeService from "../../services/codeService.js";
import * as userService from "../../services/userService.js";

/**
 * Return the QR codes scan history.
 * Every redirection of QR code with its id, QR code id and date of the redirection
 * is included in the response body in JSON format.
 */
const getRedirectHistory = async ({ params, response, user }) => {

  // Check that QR code is owned by that user
  const isOwner = await userService.isOwner(user.id, params.qrid).then((res) => {
    return res;
  });

  if (isOwner.length == 1) {
    await codeService.getRedirectHistory(params.qrid).then((history) => {
      // if no redirections exist in the database return empty
      if (history.length == 0) {
        response.body = {};
        return;
      } else {
        const file = { 
          redirectHistory: history,
          meta: { qrId: params.qrid, foundEntries: history.length },
        };
        response.body = file;
        return;
      }
    });
  } else {
    // Not owner of the QR code
    response.status = 401;
    return;
  }
};

/**
 * Return the QR codes edit history.
 * Every edit of the QR code with its id, QR code id and new link and/or comment.
 */
const getEditHistory = async ({ params, response, user }) => {

  // Check that QR code is owned by that user
  const isOwner = await userService.isOwner(user.id, params.qrid).then((res) => {
    return res;
  });

  if (isOwner.length == 1) {
    await codeService.getEditHistory(params.qrid).then((history) => {
      // if no redirections exist in the database return empty
      if (history.length == 0) {
        response.body = {};
        return;
      } else {
        const file = { 
          editHistory: history,
          meta: { qrId: params.qrid, foundEntries: history.length },
        };
        response.body = file;
        return;
      }
    });
  } else {
    // Not owner of the QR code
    response.status = 401;
    return;
  }
};

export { getRedirectHistory, getEditHistory };
