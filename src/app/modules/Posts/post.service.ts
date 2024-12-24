import { Post, Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpars/paginationHelper";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";

const create = async (files: any, user: IAuthUser, payload: Post) => {
    const thumbnailFile = files?.thumbnail?.[0]?.path || "";
    const imageFiles = files?.images
        ? files?.images.map((file: { path: any }) => file.path)
        : [];

    if (thumbnailFile) {
        payload.thumbnail = thumbnailFile;
    }

    const result = await prisma.$transaction(async (tx) => {
        const createProduct = await tx.post.create({
            data: payload,
        });
        if (imageFiles.length > 0) {
            await tx.image.createMany({
                data: imageFiles.map((image: string) => ({
                    url: image,
                    productId: createProduct.id,
                })),
            });
        }
    });

    return result;
};

const getAll = async (
    params: Record<string, unknown>,
    options: IPaginationOptions
) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, minPrice, maxPrice, ...filterData } = params;

    const andConditions: Prisma.PostWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: ["name", "categoryId"].map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    const whereConditions: Prisma.PostWhereInput = { AND: andConditions };

    const result = await prisma.post.findMany({
        where: whereConditions,
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
        include: {
            category: true,
        },
    });

    const total = await prisma.post.count({
        where: whereConditions,
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

const getOne = async (slug: string) => {
    const result = await prisma.post.findUnique({
        where: {
            slug,
        },
        include: {
            category: true,
        },
    });

    return result;
};

const update = async (id: string, files: any, data: Partial<Post>) => {
    await prisma.post.findUniqueOrThrow({
        where: { id },
    });

    const thumbnailFile = files?.thumbnail?.[0]?.path || "";

    if (thumbnailFile) {
        data.thumbnail = thumbnailFile;
    }

    const result = await prisma.post.update({
        where: { id },
        data,
    });

    return result;
};

const remove = async (id: string): Promise<Post | null> => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id,
        },
    });

    const result = await prisma.post.delete({
        where: {
            id,
        }
    });

    return result;
};

export const PostService = {
    create,
    getAll,
    getOne,
    update,
    remove,
};
