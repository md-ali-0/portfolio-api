import { AboutMe } from "@prisma/client";
import prisma from "../../../shared/prisma";

const getOne = async (): Promise<AboutMe | null> => {
    const result = await prisma.aboutMe.findFirst();
    return result;
};

const upsertAboutMe = async (data: Partial<AboutMe>): Promise<AboutMe> => {
    const existingRecord = await prisma.aboutMe.findFirst();

    if (existingRecord) {
        const updatedRecord = await prisma.aboutMe.update({
            where: {
                id: existingRecord.id,
            },
            data,
        });

        return updatedRecord;
    } else {
        const newRecord = await prisma.aboutMe.create({
            data: {
                cvUrl: data.cvUrl || "",
                shortDescription: data.shortDescription || "",
                aboutMe: data.aboutMe || "",
            },
        });

        return newRecord;
    }
};

export const AboutMeService = {
    getOne,
    upsertAboutMe,
};
