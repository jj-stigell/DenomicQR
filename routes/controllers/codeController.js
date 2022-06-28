import * as codeService from "../../services/codeService.js";
import * as userService from "../../services/userService.js";
import { validasaur, qrcode, ShortUniqueId } from "../../deps.js";
import { URL, uuidLength, urlRules, commentMinLength, commentMaxLength } from "../../config/settings.js";

const uidGen = new ShortUniqueId.default();

const qrValidationRules = {
  url: [validasaur.required, validasaur.match(urlRules)],
  comment: [validasaur.required, validasaur.lengthBetween(commentMinLength, commentMaxLength)],
};

const validateComment = {
  comment: [validasaur.required, validasaur.lengthBetween(commentMinLength, commentMaxLength)],
};

const validateUrl = {
  url: [validasaur.required, validasaur.match(urlRules)],
};

/** List all codes that are created by the user. */ 
const listCodes = async ({ render, user }) => {
  await codeService.getUserCodes(user.id).then((codes) => {
    render("qrCodes.eta", {
      qrCodes: codes,
      user: user,
      url: [],
      comment: [],
    });
  });
};

/** List all codes that are created by the user. */ 
const showAddCode = async ({ render, user }) => {
  render("addCode.eta", {
    user: user,
    url: [],
    comment: [],
    commentMin: commentMinLength,
    commentMax: commentMaxLength,
  });
};

/** Add new QR code */
const addCode = async ({ request, response, render, user }) => {

  const body = request.body({ type: "form" });
  const params = await body.value;
  const link = params.get("urlInput");
  const comment = params.get("commentInput");
  const newQrData = await getQrData(request, user);

  const [passes, errors] = await validasaur.validate(
    newQrData,
    qrValidationRules,
  );

  if (!passes) {
    newQrData.validationErrors = errors;
    newQrData.user = user;
    newQrData.commentMin = commentMinLength;
    newQrData.commentMax = commentMaxLength;
    render("addCode.eta", newQrData);
    return;
  } else {
    const qrID = uidGen(uuidLength);

    const qrCode = await qrcode(URL + qrID).then((code) => {
      return code;
    });

    if (qrCode) {
      await codeService.addNewCode(qrID, user.id, qrCode, link, comment).then(() => {
        response.redirect("/edit/" + qrID);
        return;
      });
    }
  }
};

/** 
 * Redirect when user opens scanned QR code. 
 * If the link does not exist, direct to 404 page. 
 */
const redirect = async ({ params, response, render }) => {

  const link = await codeService.getLink(params.qrid).then((link) => {
    return link;
  });

  if (link.length != 0) {
    await codeService.addView(link[0].qrid);
    response.redirect(link[0].linksto)
    return;
  } else {  
    response.status = 404;
    render("notFound.eta");
    return;
  }
};

/**
 * Get the form data from user QR code generation request.
 * @returns {array} new QR code data and users private codes
 */
const getQrData = async (request, user) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  return {
    url: params.get("urlInput"),
    comment: params.get("commentInput"),
    qrCodes: await codeService.getUserCodes(user.id),
  };
};

/** Delete question based on its id */
const deleteCode = async ({ params, response, user }) => {

  // Check that QR code is owned by that user
  const isOwner = await userService.isOwner(user.id, params.qrid).then((res) => {
    return res;
  });

  if (isOwner.length == 1) {
    await codeService.deleteCode(params.qrid);
    response.redirect("/mycodes");
    return;
  } else {
    // Not owner of the QR code
    response.status = 401;
    return;
  }
};

/** Show individual QR code */
const showCode = async ({ render, user, params, response }) => {

  // Check that QR code is owned by that user
  const isOwner = await userService.isOwner(user.id, params.qrid).then((res) => {
    return res;
  });

  if (isOwner.length == 1) {
    await codeService.getCode(params.qrid).then((code) => {
      render("codeEdit.eta", {
        qrCode: code,
        user: user,
        commentMin: commentMinLength,
        commentMax: commentMaxLength,
      });
    });
  } else {
    // Not owner of the QR code
    response.status = 401;
    return;
  }
};

/** 
 * Update existing QR code. Redirect to
 * correct function based on what user want to edit.
 */
 const updateCode = async ({ request, response, render, user, params }) => {

  // Check that QR code is owned by that user
  const isOwner = await userService.isOwner(user.id, params.qrid).then((res) => {
    return res;
  });

  if (isOwner.length == 1) {

    const body = request.body({ type: "form" });
    const value = await body.value;
    const url = value.get("urlEditInput");
    const comment = value.get("commentEditInput");

    if (!comment && url) {
      // Update url

      const updatedUrl = { url: url };
      const [passes, errors] = await validasaur.validate(
        updatedUrl,
        validateUrl,
      );

      if (!passes) {
        await codeService.getCode(params.qrid).then((code) => {
          render("codeEdit.eta", {
            qrCode: code,
            user: user,
            validationErrors: errors,
            commentMin: commentMinLength,
            commentMax: commentMaxLength,
          });
          return;
        });
      } else {

        const update = await codeService.updateUrl(params.qrid, url).then((res) => {
          response.redirect("/edit/" + params.qrid);
          return res;
        });

        // If update is succesfull, update edit history
        if (update) {
          await codeService.updateEditHistory(params.qrid, url, comment);
        }
        return;
      }
    } else if (comment && !url) {
      // Update comment

      const updatedComment = { comment: comment };
      const [passes, errors] = await validasaur.validate(
        updatedComment,
        validateComment,
      );

      if (!passes) {
        await codeService.getCode(params.qrid).then((code) => {
          render("codeEdit.eta", {
            qrCode: code,
            user: user,
            validationErrors: errors,
            commentMin: commentMinLength,
            commentMax: commentMaxLength,
          });
          return;
        });
      } else {

        const update = await codeService.updateComment(params.qrid, comment).then((res) => {
          response.redirect("/edit/" + params.qrid);
          return res;
        });

        // If update is succesfull, update edit history
        if (update) {
          await codeService.updateEditHistory(params.qrid, url, comment);
        }
        return;
      }
    } else if (comment && url) {
      // Update both

      const updatedQrCode = {
        url: url,
        comment: comment
      };
      const [passes, errors] = await validasaur.validate(
        updatedQrCode,
        qrValidationRules,
      );

      if (!passes) {
        await codeService.getCode(params.qrid).then((code) => {
          render("codeEdit.eta", {
            qrCode: code,
            user: user,
            validationErrors: errors,
            commentMin: commentMinLength,
            commentMax: commentMaxLength,
          });
          return;
        });
      } else {

        const update = await codeService.updateUrlAndComment(params.qrid, url, comment).then((res) => {
          response.redirect("/edit/" + params.qrid);
          return res;
        });

        // If update is succesfull, update edit history
        if (update) {
          await codeService.updateEditHistory(params.qrid, url, comment);
        }
        return;
      }
    } else {
      response.redirect("/edit/" + params.qrid);
      return;
    };

  } else {
    // Not owner of the QR code
    response.status = 401;
    return;
  }
};

export { 
  listCodes,
  showAddCode,
  addCode,
  deleteCode,
  redirect,
  showCode,
  updateCode,
};
