import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function SeedDB() {
    const adminExists = await prisma.user.findFirst({
        where: { role: Role.ADMIN },
    });

    if (!adminExists) {
        const hashedPassword = await bcrypt.hash("12345678", 10);

        await prisma.user.create({
            data: {
                name: "Mohammad Ali",
                email: "md.ali.office@gmail.com",
                password: hashedPassword,
                role: Role.ADMIN,
            },
        });

        console.log("Admin account created");
    }
}