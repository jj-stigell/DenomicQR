import { superoak } from "../deps.js";
import { app } from "../app.js";

const timeout = 10000

Deno.test("GET request to / should return 200 'OK'", async () => {
  const testClient = await superoak(app);
  await testClient.get("/")
    .expect(200);
}, timeout);

Deno.test("GET request to /faq should return 200 'OK'", async () => {
  const testClient = await superoak(app);
  await testClient.get("/faq")
    .expect(200);
}, timeout);

Deno.test("GET request to /auth/login should return 200 'OK'", async () => {
  const testClient = await superoak(app);
  await testClient.get("/auth/login")
    .expect(200);
}, timeout);

Deno.test("GET request to /auth/register should return 200 'OK'", async () => {
  const testClient = await superoak(app);
  await testClient.get("/auth/register")
    .expect(200);
}, timeout);

Deno.test("GET request to /edhist/12345 without sign in should return 401 'Unauthorized'", async () => {
  const testClient = await superoak(app);
  await testClient.get("/edhist/123456")
    .expect(401);
}, timeout);

Deno.test("GET request to /rehist/12345 without sign in should return 401 'Unauthorized'", async () => {
  const testClient = await superoak(app);
  await testClient.get("/rehist/123456")
    .expect(401);
}, timeout);

Deno.test({
  name: "GET request to working QR code redirection /code/2aMUrVVT should return 302 'Found'",
  async fn() {
    const testClient = await superoak(app);
    await testClient.get("/code/ndJk0Ss2")
      .expect(302)
  },
  sanitizeResources: false,
  sanitizeOps: false,
}, timeout);

Deno.test({
  name: "GET request to non-existing QR code redirection /code/123456 should return 404 'Not Found'",
  async fn() {
    const testClient = await superoak(app);
    await testClient.get("/code/123456")
      .expect(404)
  },
  sanitizeResources: false,
  sanitizeOps: false,
}, timeout);
