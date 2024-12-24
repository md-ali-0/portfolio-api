import { Language, Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpars/paginationHelper";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";

const create = async (payload: any) => {
    const result = await prisma.language.create({
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

    const andCondions: Prisma.LanguageWhereInput[] = [];
    
    //console.log(filterData);
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
    const whereConditons: Prisma.LanguageWhereInput = { AND: andCondions };

    const result = await prisma.language.findMany({
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
    
    const total = await prisma.language.count({
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

const getOne = async (id: string): Promise<Language | null> => {
    const result = await prisma.language.findUnique({
        where: {
            id,
        },
    });

    return result;
};

const update = async (
    id: string,
    data: Partial<Language>
): Promise<Language> => {
    await prisma.language.findUniqueOrThrow({
        where: {
            id,
        },
    });

    const result = await prisma.language.update({
        where: {
            id,
        },
        data,
    });

    return result;
};

const remove = async (id: string): Promise<Language | null> => {
    await prisma.language.findUniqueOrThrow({
        where: {
            id,
        },
    });

    const result = await prisma.language.delete({
        where: {
            id,
        }
    });
    
    return result;
};

export const LanguageService = {
    create,
    getAll,
    getOne,
    update,
    remove,
};
