import { Router } from "express";

import { tryCatch } from "../middleware/errors.js";
import { authorizeUser } from "../middleware/authorization.js";

import controller from "../controllers/orders.js";

const router = Router();

router.use(authorizeUser);

router.get("/pending", tryCatch(controller.getPendingOrders));
router.post("/complete/:orderId", tryCatch(controller.completeOrder));
router.post("/cancel/:orderId", tryCatch(controller.cancelOrder));

export default router;
