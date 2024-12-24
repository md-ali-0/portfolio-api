import { Role, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import emailSender from "./emailSender";

const generateTokens = (user: { id: string; role: Role }) => {
    const accessToken = jwtHelpers.generateToken(
        { user: user.id, role: user.role },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );

    const refreshToken = jwtHelpers.generateToken(
        { user: user.id, role: user.role },
        config.jwt.refresh_token_secret as Secret,
        config.jwt.refresh_token_expires_in as string
    );

    return { accessToken, refreshToken };
};

const loginUser = async (payload: { email: string; password: string }) => {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            "User not found or inactive!"
        );
    }
    if (user.status === UserStatus.SUSPEND) {
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            "User Suspended"
        );
    }
    if (user.isDeleted) {
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            "User Deleted"
        );
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Incorrect password!");
    }

    const tokens = generateTokens(user);

    return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
    };
};

const changePassword = async (
    user: { email: string },
    payload: { oldPassword: string; newPassword: string }
) => {
    const { oldPassword, newPassword } = payload;

    const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
    });

    if (!existingUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");
    }

    const isCorrectPassword = await bcrypt.compare(
        oldPassword,
        existingUser.password
    );

    if (!isCorrectPassword) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Incorrect old password!");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
        where: { email: existingUser.email },
        data: { password: hashedPassword },
    });

    return { message: "Password changed successfully!" };
};

const forgotPassword = async (payload: { email: string }) => {
    const { email } = payload;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");
    }

    const resetToken = jwtHelpers.generateToken(
        { email: user.email, role: user.role },
        config.jwt.reset_pass_secret as Secret,
        config.jwt.reset_pass_token_expires_in as string
    );

    const resetLink = `${config.reset_pass_link}?token=${resetToken}`;

    await emailSender(
        email,
        `<p>Dear User,</p>
         <p>Click the link below to reset your password:</p>
         <a href="${resetLink}">Reset Password</a>`
    );
};


const resetPassword = async (token: string, payload: { password: string }) => {
    let decodedToken;
    try {
        decodedToken = jwtHelpers.verifyToken(
            token,
            config.jwt.reset_pass_secret as Secret
        );

    } catch (err) {
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            "Invalid or expired token!"
        );
    }

    const hashedPassword = await bcrypt.hash(payload.password, 12);

    await prisma.user.update({
        where: { email: decodedToken.email },
        data: { password: hashedPassword },
    });

    return { message: "Password reset successful!" };
};

export const AuthServices = {
    loginUser,
    changePassword,
    forgotPassword,
    resetPassword,
};
