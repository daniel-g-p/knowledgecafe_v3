import { Router } from "express";

import { tryCatch } from "../middleware/errors.js";
import { authorizeUser, authorizeAdmin } from "../middleware/authorization.js";

import controller from "../controllers/team.js";

const router = Router();

router.use(authorizeUser);

router.get("/", authorizeUser, tryCatch(controller.getTeamMembers));
router.post("/", authorizeAdmin, tryCatch(controller.newUser));
router.put("/set-role/:userId", authorizeAdmin, tryCatch(controller.setRole));
router.delete("/:userId", authorizeAdmin, tryCatch(controller.deleteMember));

export default router;
