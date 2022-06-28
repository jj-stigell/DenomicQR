import { localPort } from "./config/settings.js";
import { app } from "./app.js";

/**
 * When deploying locally app listens to port that is 
 * set in the settings.js file located in config folder.
 */
app.listen({ port: localPort });
