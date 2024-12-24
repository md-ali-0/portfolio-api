import { Role } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { SkillController } from "./skill.controller";

const router = Router();

router.get("/", SkillController.getAll);
router.get("/:id", SkillController.getOne);
router.post("/", auth(Role.ADMIN),SkillController.create);
router.patch("/:id", auth(Role.ADMIN),SkillController.update);
router.delete("/:id", auth(Role.ADMIN),SkillController.remove);

export const SkillRoutes = router;
