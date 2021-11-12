import { Router } from "express";

import { tryCatch } from "../middleware/errors.js";
import { authorizeUser } from "../middleware/authorization.js";

import controller from "../controllers/products.js";

const router = Router();

router.use(authorizeUser);

router.get("/", tryCatch(controller.getProducts));
router.post("/", tryCatch(controller.newProduct));
router.put("/:productId", tryCatch(controller.editProduct));
router.delete("/:productId", tryCatch(controller.deleteProduct));

export default router;
