import { dotEnvConfig } from "../../deps.js";
dotEnvConfig({ export: true });

/**
 * Database credentials.
 * creds read from .env file in the project root.
 * Using default PostgreSQL port 5432
 */
 export default
 {
   hostname: Deno.env.get("DBHOSTNAME"),
   database: Deno.env.get("DATABASE"),
   user: Deno.env.get("DBUSER"),
   password: Deno.env.get("DBPASSWORD"),
   port: Deno.env.get("DBPORT"),
 }
 