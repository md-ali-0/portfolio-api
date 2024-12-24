import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import { userService } from "./user.sevice";

const getMyProfile = catchAsync(
    async (req: Request & { user?: IAuthUser }, res: Response) => {
        const user = req.user;

        const result = await userService.getMyProfile(user as IAuthUser);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "My profile data fetched!",
            data: result,
        });
    }
);

const updateMyProfie = catchAsync(
    async (req: Request & { user?: IAuthUser }, res: Response) => {
        const user = req.user;

        const result = await userService.updateMyProfie(
            user as IAuthUser,
            req.files,
            req.body
        );

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "My profile updated!",
            data: result,
        });
    }
);

const DeleteUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await userService.DeleteUser(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User data deleted!",
        data: result,
    });
});


export const userController = {
    getMyProfile,
    updateMyProfie,
    DeleteUser
};
