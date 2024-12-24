import { Role } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { TechnologyController } from "./technology.controller";

const router = Router();

router.get("/", TechnologyController.getAll);
router.get("/:id", TechnologyController.getOne);
router.post("/", auth(Role.ADMIN),TechnologyController.create);
router.patch("/:id", auth(Role.ADMIN),TechnologyController.update);
router.delete("/:id", auth(Role.ADMIN),TechnologyController.remove);

export const TechnologyRoutes = router;
