import { send } from "../deps.js";

/** For serving static resources suchs as css, favicon, images, scripts. */
const serveStaticMiddleware = async (context, next) => {
  if (context.request.url.pathname.startsWith("/static")) {
    const path = context.request.url.pathname.substring(7);

    await send(context, path, {
      root: `${Deno.cwd()}/static`,
    });
  } else {
    await next();
  }
};

export { serveStaticMiddleware };
