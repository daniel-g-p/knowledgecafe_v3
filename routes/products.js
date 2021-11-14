import { Router } from "express";

import { tryCatch } from "../middleware/errors.js";
import { authorizeUser, authorizeAdmin } from "../middleware/authorization.js";

import controller from "../controllers/products.js";

const router = Router();

router.use(authorizeUser);

router.get("/", tryCatch(controller.getProducts));
router.post("/", authorizeAdmin, tryCatch(controller.newProduct));
router.put("/:productId", authorizeAdmin, tryCatch(controller.editProduct));
router.delete("/:productId", authorizeAdmin, tryCatch(controller.deleteProduct));

export default router;
