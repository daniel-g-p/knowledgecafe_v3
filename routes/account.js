import { Router } from "express";

import { tryCatch } from "../middleware/errors.js";
import { authorizeUser } from "../middleware/authorization.js";

import controller from "../controllers/account.js";

const router = Router();

router
  .route("/login")
  .get(tryCatch(controller.verifyLogin))
  .post(tryCatch(controller.login));

router
  .route("/registration/:userId")
  .get(tryCatch(controller.getRegistrationPage))
  .post(tryCatch(controller.completeRegistration));

router
  .route("/user")
  .get(authorizeUser, tryCatch(controller.getUserData))
  .put(authorizeUser, tryCatch(controller.editUser));

router.post(
  "/change-password",
  authorizeUser,
  tryCatch(controller.changePassword)
);

router.get("/logout", tryCatch(controller.logout));

export default router;
