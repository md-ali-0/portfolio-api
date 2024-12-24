import { Role } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { LanguageController } from "./language.controller";

const router = Router();

router.get("/", LanguageController.getAll);
router.get("/:id", LanguageController.getOne);
router.post("/", auth(Role.ADMIN),LanguageController.create);
router.patch("/:id", auth(Role.ADMIN),LanguageController.update);
router.delete("/:id", auth(Role.ADMIN),LanguageController.remove);

export const LanguageRoutes = router;
