const restrictedPaths = ["/add", "/del", "/edit", "/mycodes", "/logout"];
const apiPaths = ["/rehist", "/edhist"];

/**
 * User allowed to acces restrictedPaths only if authorized (logged in).
 * Function some checks whether at least one of the elements 
 * in the restricted paths array matches the given test; here, 
 * whether the requested path starts with a given restricted path.
 * Unauthorized API request are responded with status code 401.
 */
const authMiddleware = async (context, next) => {
  const user = await context.state.session.get("user");

  if (!user && restrictedPaths.some((path) => context.request.url.pathname.startsWith(path))) {
    context.response.redirect("/auth/login");
    return;
  } else if (!user && apiPaths.some((path) => context.request.url.pathname.startsWith(path))) {
    context.response.status = 401;
    return;
  } else {
    await next();
  }
};

export { authMiddleware };
