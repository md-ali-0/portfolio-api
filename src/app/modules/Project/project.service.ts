import { Prisma, Project } from "@prisma/client";
import { paginationHelper } from "../../../helpars/paginationHelper";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";

const create = async (files: any, user: IAuthUser, payload: any) => {
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

        return createProject;
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

    console.log(data);
    

    const existingProject = await prisma.project.findUnique({
        where: { id },
        include: { images: true},
    });

    if (!existingProject) {
        throw new Error("Project not found");
    }

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

    const project = await prisma.project.findUnique({
        where: {
            id,
        },
        include: {
            images: true,
        },
    });

    if (!project) {
        throw new Error("Project not found");
    }

    const result = await prisma.$transaction(async (tx) => {

        if (project.images.length > 0) {
            await tx.image.updateMany({
                where: {
                    projectId: id,
                },
                data: {
                    projectId: null,
                },
            });
        }

        const deletedProject = await tx.project.delete({
            where: {
                id,
            },
        });

       await tx.image.deleteMany({
            where: {
                projectId: id,
            },
        });

        return deletedProject;
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
