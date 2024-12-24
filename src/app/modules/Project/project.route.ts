import { Role } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import { upload } from "../../../config/multer.config";
import auth from "../../middlewares/auth";
import { ProjectController } from "./project.controller";

const router = Router();

router.get("/", ProjectController.getAll);
router.get("/:slug", ProjectController.getOne);
router.post(
    "/",
    auth(Role.ADMIN),
    upload.fields([
        { name: "images", maxCount: 10 },
        { name: "thumbnail", maxCount: 1 },
    ]),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        next();
    },
    ProjectController.create
);

router.patch(
    "/:id",
    auth(Role.ADMIN),
    upload.fields([
        { name: "images", maxCount: 10 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        next();
    },
    ProjectController.update
);

router.delete("/:id", auth(Role.ADMIN), ProjectController.remove);

export const ProjectRoutes = router;
