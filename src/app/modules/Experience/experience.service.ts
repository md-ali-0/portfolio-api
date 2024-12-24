import { Experience, Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpars/paginationHelper";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";

const create = async (payload: any) => {
    const result = await prisma.experience.create({
        data: payload,
    });

    return result;
};

const getAll = async (
    params: Record<string, unknown>,
    options: IPaginationOptions
) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andCondions: Prisma.ExperienceWhereInput[] = [];

    if (params.searchTerm) {
        andCondions.push({
            OR: ["name", "slug"].map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    //console.dir(andCondions, { depth: 'inifinity' })
    const whereConditons: Prisma.ExperienceWhereInput = { AND: andCondions };

    const result = await prisma.experience.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? {
                      [options?.sortBy]: options.sortOrder,
                  }
                : {
                      createdAt: "desc",
                  },
    });
    
    const total = await prisma.experience.count({
        where: whereConditons,
    });

    const totalPage = Math.ceil(total / limit);

    return {
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
        data: result,
    };
};

const getOne = async (id: string): Promise<Experience | null> => {
    const result = await prisma.experience.findUnique({
        where: {
            id,
        },
    });

    return result;
};

const update = async (
    id: string,
    data: Partial<Experience>
): Promise<Experience> => {
    await prisma.experience.findUniqueOrThrow({
        where: {
            id,
        },
    });

    const result = await prisma.experience.update({
        where: {
            id,
        },
        data,
    });

    return result;
};

const remove = async (id: string): Promise<Experience | null> => {
    await prisma.experience.findUniqueOrThrow({
        where: {
            id,
        },
    });

    const result = await prisma.experience.delete({
        where: {
            id,
        },
    });
    
    return result;
};

export const ExperienceService = {
    create,
    getAll,
    getOne,
    update,
    remove,
};
