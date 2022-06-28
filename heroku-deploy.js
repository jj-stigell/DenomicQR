import { localPort } from "./config/settings.js";
import { app } from "./app.js";

let port = localPort;
if (Deno.args.length > 0) {
  const lastArgument = Deno.args[Deno.args.length - 1];
  port = Number(lastArgument);
}

/**
 * When deploying to Heroku app listens on default to port
 * that is set in the settings.js file located in config folder.
 * Heroku can make changes to this port.
 */
app.listen({ port: port });
