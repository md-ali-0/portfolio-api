import { Prisma, Project } from "@prisma/client";
import { paginationHelper } from "../../../helpars/paginationHelper";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";

const create = async (files: any, user: IAuthUser, payload: Project) => {

    const thumbnailFile = files?.thumbnail?.[0]?.path || "";
    const imageFiles = files?.images
        ? files?.images.map((file: { path: any }) => file.path)
        : [];

    if (thumbnailFile) {
        payload.thumbnail = thumbnailFile;
    }

    const result = await prisma.$transaction(async (tx) => {
        const createProject = await tx.project.create({
            data: payload,
        });
        if (imageFiles.length > 0) {
            await tx.image.createMany({
                data: imageFiles.map((image: string) => ({
                    url: image,
                    projectId: createProject.id,
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
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.ProjectWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: ["name", "brandId", "categoryId", "shopId"].map((field) => ({
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

    const whereConditions: Prisma.ProjectWhereInput = { AND: andConditions };

    const result = await prisma.project.findMany({
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
    });


    const total = await prisma.project.count({
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
    const result = await prisma.project.findUnique({
        where: {
            slug,
        },
        include: {
            images: true,
        },
    });

    return result;
};

const update = async (id: string, files: any, data: Partial<Project>) => {
    const existingProject = await prisma.project.findUniqueOrThrow({
        where: { id },
        include: { images: true },
    });

    const thumbnailFile = files?.thumbnail?.[0]?.path || "";
    const newImageFiles = files?.images
        ? files?.images.map((file: { path: string }) => file.path)
        : [];

    if (thumbnailFile) {
        data.thumbnail = thumbnailFile;
    }

    const result = await prisma.$transaction(async (tx) => {
        const updatedProject = await tx.project.update({
            where: { id },
            data,
        });

        if (newImageFiles.length > 0) {
            const oldImages = existingProject.images;
            const imagesToDelete = oldImages.filter(
                (image) => !newImageFiles.includes(image.url)
            );

            if (imagesToDelete.length > 0) {
                await tx.image.deleteMany({
                    where: {
                        id: {
                            in: imagesToDelete.map((image) => image.id),
                        },
                    },
                });
            }

            await tx.image.createMany({
                data: newImageFiles.map((image: any) => ({
                    url: image,
                    projectId: updatedProject.id,
                })),
            });
        }

        return updatedProject;
    });

    return result;
};

const remove = async (id: string): Promise<Project | null> => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id,
        },
    });

    const result = await prisma.post.delete({
        where: {
            id,
        },
    });

    return result;
};

export const ProjectService = {
    create,
    getAll,
    getOne,
    update,
    remove,
};
