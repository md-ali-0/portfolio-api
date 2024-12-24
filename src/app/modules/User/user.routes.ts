import { Role } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { upload } from "../../../config/multer.config";
import auth from "../../middlewares/auth";
import { userController } from "./user.controller";

const router = express.Router();

router.get(
    "/me",
    auth(Role.ADMIN, Role.USER),
    userController.getMyProfile
);

router.put(
    "/me",
    auth(Role.ADMIN, Role.USER),
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        next();
    },
    userController.updateMyProfie
);

router.delete("/:id", auth(Role.ADMIN), userController.DeleteUser);

export const userRoutes = router;
