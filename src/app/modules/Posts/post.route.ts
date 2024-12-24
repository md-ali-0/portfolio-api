import { Role } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import { upload } from "../../../config/multer.config";
import auth from "../../middlewares/auth";
import { PostController } from "./post.controller";

const router = Router();

router.get("/", PostController.getAll);
router.get("/:slug", PostController.getOne);
router.post(
    "/",
    auth(Role.ADMIN),
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
    ]),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        next();
    },
    PostController.create
);

router.patch(
    "/:id",
    auth(Role.ADMIN),
    upload.fields([
        { name: "thumbnail", maxCount: 1 }
    ]),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        next();
    },
    PostController.update
);

router.delete("/:id", auth(Role.ADMIN), PostController.remove);

export const PostRoutes = router;
