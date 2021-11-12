import { Router } from "express";

import { tryCatch } from "../middleware/errors.js";
import { authorizeUser } from "../middleware/authorization.js";

import controller from "../controllers/account.js";

const router = Router();

router.get("/login", tryCatch(controller.verifyLogin));
router.post("/login", tryCatch(controller.login));
router.get("/user", authorizeUser, tryCatch(controller.getUserData));
router.put("/user", authorizeUser, tryCatch(controller.editUser));
router.post(
  "/change-password",
  authorizeUser,
  tryCatch(controller.changePassword)
);
router.get("/logout", tryCatch(controller.logout));

export default router;
