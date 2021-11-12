import { Router } from "express";

import { tryCatch } from "../middleware/errors.js";

import controller from "../controllers/shop.js";

const router = Router();

router.get("/", tryCatch(controller.getShopItems));
router.post("/", tryCatch(controller.placeOrder));

export default router;