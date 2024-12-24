import { Request, RequestHandler, Response } from "express";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";

import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import { SkillService } from "./skill.service";

const create = catchAsync(async (req: Request, res: Response) => {
    const result = await SkillService.create(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Skill data Created!",
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
        const result = await SkillService.getAll(filters, options);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Skill data fetched!",
            meta: result.meta,
            data: result.data,
        });
    }
);

const getOne = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await SkillService.getOne(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Skill data fetched by id!",
        data: result,
    });
});

const update = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await SkillService.update(id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Skill data updated!",
        data: result,
    });
});

const remove = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await SkillService.remove(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Skill data deleted!",
        data: result,
    });
});

export const SkillController = {
    create,
    getAll,
    getOne,
    update,
    remove,
};
