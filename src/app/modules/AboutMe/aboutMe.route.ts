import { Role } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { AboutMeController } from "./aboutMe.controller";

const router = Router();

router.get("/", AboutMeController.getOne);
router.patch("/", auth(Role.ADMIN),AboutMeController.update);

export const AboutMeRoutes = router;
