import { bcrypt } from "../../deps.js";
import * as userService from "../../services/userService.js";
import { validasaur } from "../../deps.js";
import { passMinLength, passMaxLength } from "../../config/settings.js"

/**
 * Validation rules for registration.
 * Email must be valid. Password minimum length defined
 * in the settings.js file.
 */
const registerValidationRules = {
  email: [validasaur.required, validasaur.isEmail],
  password: [validasaur.required, validasaur.lengthBetween(passMinLength, passMaxLength)],
};

/**
 * Get the form data from user registration request.
 * @param {string} request 
 * @returns {array} registration email and password
 */
const getRegisterData = async (request) => {  
  const body = request.body({ type: "form" });
  const params = await body.value;
  return {
    email: params.get("email"),
    password: params.get("password"),
    passwordConfirm: params.get("passwordConfirm"),
  };
};

/**
 * Register a new user.
 * Validation is done using validasaur library.
 * Password is hashed with bcrypt.
 */
const registerUser = async ({ request, response, render }) => {
  const regData = await getRegisterData(request);
  regData.passMinLength = passMinLength;
  regData.passMaxLength = passMaxLength;

  // Validate input to check for errors
  const [passes, errors] = await validasaur.validate(
    regData,
    registerValidationRules,
  );

  // Check for the email availability
  const emailAvailabe = await userService.findUserByEmail(regData.email).then((res) => {
    return res;
  });

  if (!passes) {
    regData.validationErrors = errors;
    render("registration.eta", regData);
    return;
  } else if (emailAvailabe != 0) {
    regData.validationErrors = {
      email: {inUse: 'Email already in use'},
    };
    render("registration.eta", regData);
    return;
  } else if (regData.password != regData.passwordConfirm) {
    regData.validationErrors = {
      password: {noMatch: 'Password and confirmation do not match'},
    };
    render("registration.eta", regData);
    return;
  } else {
    await userService.addUser(
      regData.email,
      await bcrypt.hash(regData.password),
    );
    response.redirect("/auth/login");
  }
};

/**
 * Load the registration. Errors, email and password
 * empty, used if problems in validation, reduces user
 * need to input multiple times the same information.
 */
const showRegistrationForm = ({ render, user, response }) => {
  if (user) {
    response.redirect("/mycodes");
    return;
  } else {
    render("registration.eta",  {
      errors: [],
      email: "",
      password: "",
      passMinLength: passMinLength,
      passMaxLength: passMaxLength,
    });
  }
};

export { registerUser, showRegistrationForm };
