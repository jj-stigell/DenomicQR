import * as userService from "../services/userService.js";

const userMiddleware = async (context, next) => {
  const user = await context.state.session.get("user");

  if (user) {
    const userFromDatabase = await userService.findUserByEmail(user.email);
    context.user = userFromDatabase[0];
  }

  await next();
};

export { userMiddleware };
