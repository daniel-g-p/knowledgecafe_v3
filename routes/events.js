import { Router } from "express";

import { tryCatch } from "../middleware/errors.js";
import { authorizeUser } from "../middleware/authorization.js";

import controller from "../controllers/events.js";

const router = Router();

router.use(authorizeUser);

router.get("/", tryCatch(controller.getEvents));
router.post("/open", tryCatch(controller.startEvent));
router.post("/close", tryCatch(controller.closeEvent));

export default router;
