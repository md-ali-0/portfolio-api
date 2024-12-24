import { Request, RequestHandler, Response } from "express";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";

import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/common";
import { ProjectService } from "./project.service";

const create = catchAsync(async (req: Request  & { user?: IAuthUser }, res: Response) => {
    const user = req.user
    const result = await ProjectService.create(req.files, user as IAuthUser, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Project data created",
        data: result,
    });
});

const getAll: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const filters = pick(req.query, [
            "name",
            "brandId",
            "categoryId",
            "shopId",
            "minPrice",
            "maxPrice",
            "searchTerm"
        ]);
        const options = pick(req.query, [
            "limit",
            "page",
            "sortBy",
            "sortOrder",
        ]);
        const result = await ProjectService.getAll(filters, options);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Project data fetched!",
            meta: result.meta,
            data: result.data,
        });
    }
);

const getOne = catchAsync(async (req: Request, res: Response) => {
    const { slug } = req.params;

    const result = await ProjectService.getOne(slug);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Project data fetched by id",
        data: result,
    });
});

const update = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await ProjectService.update(id, req.files, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Project data updated!",
        data: result,
    });
});

const remove = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await ProjectService.remove(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Project data deleted!",
        data: result,
    });
});

export const ProjectController = {
    create,
    getAll,
    getOne,
    update,
    remove,
};
