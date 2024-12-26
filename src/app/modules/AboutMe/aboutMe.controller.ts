import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";

import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import { AboutMeService } from "./aboutMe.service";

const getOne = catchAsync(async (req: Request, res: Response) => {

    const result = await AboutMeService.getOne();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "AboutMe data fetched by id!",
        data: result,
    });
});

const update = catchAsync(async (req: Request, res: Response) => {

    const result = await AboutMeService.upsertAboutMe(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "AboutMe data updated!",
        data: result,
    });
});

export const AboutMeController = {
    getOne,
    update,
};
