import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as codeController from "./controllers/codeController.js";
import * as registrationController from "./controllers/registrationController.js";
import * as loginController from "./controllers/loginController.js";
import * as logoutController from "./controllers/logoutController.js";
import * as codeApi from "./API/codeApi.js";

const router = new Router();

// Main page and faq
router.get("/", mainController.showMain);
router.get("/faq", mainController.showFaq);

// Health check
router.get("/health", (context) => {
  context.response.body = "ok";
});

// QR codes
router.get("/mycodes", codeController.listCodes);
router.post("/add", codeController.addCode);
router.get("/add", codeController.showAddCode);
router.get("/edit/:qrid", codeController.showCode);
router.post("/edit/:qrid", codeController.updateCode);
router.post("/del/:qrid", codeController.deleteCode);

// Authorization
router.get("/auth/register", registrationController.showRegistrationForm);
router.post("/auth/register", registrationController.registerUser);
router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.processLogin);
router.get("/auth/logout", logoutController.processLogout);

// Fetch and redirect
router.get("/code/:qrid", codeController.redirect);

// APIs
router.get("/rehist/:qrid", codeApi.getRedirectHistory);
router.get("/edhist/:qrid", codeApi.getEditHistory);

export { router };
