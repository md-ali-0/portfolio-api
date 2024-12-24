import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";

const getMyProfile = async (user: IAuthUser) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            id: user?.user,
        },
        select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
            phone: true,
            city: true,
            state: true,
            zip_code: true,
            address: true,
            country: true,
            role: true,
        },
    });
    
    return userInfo;
};

const updateMyProfie = async (
    user: IAuthUser,
    files: any,
    data: Partial<User>
) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            id: user?.user,
        },
    });

    const avatar = files?.avatar?.[0]?.path || "";
    if (avatar) {
        data.avatar = avatar;
    }
    if (data.password) {
        data.password = bcrypt.hashSync(data.password, 10);
    }
    const profileInfo = await prisma.user.update({
        where: {
            email: userInfo.email,
        },
        data: data,
    });
    return profileInfo;
};

const DeleteUser = async (id: string): Promise<User | null> => {

    await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    });

    const result = await prisma.user.update({
        where: {
            id
        },
        data: {
            isDeleted: false
        }
    });

    return result;
}

export const userService = {
    getMyProfile,
    updateMyProfie,
    DeleteUser
};
