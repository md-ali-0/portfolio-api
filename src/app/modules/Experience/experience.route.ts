import { Role } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { ExperienceController } from "./experience.controller";

const router = Router();

router.get("/", ExperienceController.getAll);
router.get("/:id", ExperienceController.getOne);
router.post("/", auth(Role.ADMIN),ExperienceController.create);
router.patch("/:id", auth(Role.ADMIN),ExperienceController.update);
router.delete("/:id", auth(Role.ADMIN),ExperienceController.remove);

export const ExperienceRoutes = router;
