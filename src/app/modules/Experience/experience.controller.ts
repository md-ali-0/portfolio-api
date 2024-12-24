import { Request, RequestHandler, Response } from "express";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";

import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import { ExperienceService } from "./experience.service";

const create = catchAsync(async (req: Request, res: Response) => {
    const result = await ExperienceService.create(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Experience data Created!",
        data: result,
    });
});

const getAll: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const filters = pick(req.query,  ['name', 'searchTerm']);
        const options = pick(req.query, [
            "limit",
            "page",
            "sortBy",
            "sortOrder",
        ]);
        const result = await ExperienceService.getAll(filters, options);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Experience data fetched!",
            meta: result.meta,
            data: result.data,
        });
    }
);

const getOne = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await ExperienceService.getOne(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Experience data fetched by id!",
        data: result,
    });
});

const update = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await ExperienceService.update(id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Experience data updated!",
        data: result,
    });
});

const remove = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await ExperienceService.remove(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Experience data deleted!",
        data: result,
    });
});

export const ExperienceController = {
    create,
    getAll,
    getOne,
    update,
    remove,
};
