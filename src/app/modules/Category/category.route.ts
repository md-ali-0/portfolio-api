import { Role } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { CategoryController } from "./category.controller";

const router = Router();

router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getOne);
router.post("/", auth(Role.ADMIN),CategoryController.create);
router.patch("/:id", auth(Role.ADMIN),CategoryController.update);
router.delete("/:id", auth(Role.ADMIN),CategoryController.remove);

export const CategoryRoutes = router;
