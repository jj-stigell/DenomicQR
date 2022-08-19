/**
 * Database credentials.
 * creds read from .env file in the project root if in local mode (run with argument "local").
 * Otherwise db credentials from terminal arguments.
 * 
 * Default PostgreSQL port 5432
 * 
 * NOTE: Ideally there would be separate test/local database for development, now everything uses 
 * one database for production and development.
 */

import { dotEnvConfig } from "../../deps.js";
dotEnvConfig({ export: true });

let creds;

if (Deno.args && Deno.args[0] !== "local") {
  creds =  {
    hostname: Deno.args[1],
    database: Deno.args[2],
    user: Deno.args[3],
    password: Deno.args[4],
    port: Deno.args[5],
  }
} else {
  creds =  {
    hostname: Deno.env.get("DBHOSTNAME"),
    database: Deno.env.get("DATABASE"),
    user: Deno.env.get("DBUSER"),
    password: Deno.env.get("DBPASSWORD"),
    port: Deno.env.get("DBPORT"),
  }
}

 export default creds;
