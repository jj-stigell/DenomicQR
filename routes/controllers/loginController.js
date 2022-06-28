import * as userService from "../../services/userService.js";
import { bcrypt } from "../../deps.js";

/**
 * Process the user login. Check that user
 * exists in the database and that the password matches. 
 */
const processLogin = async ({ request, response, state, render }) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  const userFromDatabase = await userService.findUserByEmail(params.get("email")).then((res) => {
    return res;
  });

  // User not found
  if (userFromDatabase.length != 1) {
    render("login.eta", { errors: "User not found!" });
    return;
  }

  const user = userFromDatabase[0];
  const passwordMatches = await bcrypt.compare(
    params.get("password"),
    user.password,
  );

  // Password mismatch
  if (!passwordMatches) {
    render("login.eta", { errors: "Password incorrect!" });
    return;
  }

  await state.session.set("user", user);
  response.redirect("/mycodes");
};

/** Load login page. */
const showLoginForm = ({ render, user, response }) => {
  if (user) {
    response.redirect("/mycodes");
    return;
  } else {
    render("login.eta");
  }
};

export { processLogin, showLoginForm };
