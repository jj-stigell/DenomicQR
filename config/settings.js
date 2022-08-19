/** Set the local host port Deno uses on default. */
const localPort = 7777;

/**
 * Set the domain where the application is hosted.
 * This is to make sure that generated QR code
 * points to the correct address and works ass intended.
 */
const URL = "https://denomic.herokuapp.com/code/";

/**
 * Sets the maximum number of concurrent connections.
 * Determines the maximum number of concurrent connections 
 * to the database server.
 */
const concurrentConnections = 2;

/**
 * Set the length for the unique UUID that is generated
 * for the QR codes. Lower the number the shorter url is generated.
 * Lower value increases probability of generating already existing code,
 * since UUID generated is not truly unique.
 */
const uuidLength = 8;

/**
 * Validation rule for the user inputted url.
 * Remember to update the client-side script.js also if you make
 * changes to the validation rules that you would like to
 * also apply to the client-side validation.
 */
const urlRules = "^(?:(?:https?):\/\/)";

/**
 * Minimum and maxmimum length allowed for the users password. 
 * Update the value also to static/script.js for client side validation.
*/
const passMinLength = 8;
const passMaxLength = 24;

/**
 * Minimum and maximum length allowed for the users comment for QR code.
 * Update the value also to static/script.js for client side validation.
*/
const commentMinLength = 10;
const commentMaxLength = 230;

 export {
    localPort,
    URL,
    concurrentConnections,
    uuidLength,
    urlRules,
    passMinLength,
    passMaxLength,
    commentMinLength,
    commentMaxLength
};
