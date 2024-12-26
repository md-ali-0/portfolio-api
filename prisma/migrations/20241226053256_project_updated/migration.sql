/*
  Warnings:

  - You are about to drop the `CV` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Language` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Technology` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LanguageToProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectToTechnology` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LanguageToProject" DROP CONSTRAINT "_LanguageToProject_A_fkey";

-- DropForeignKey
ALTER TABLE "_LanguageToProject" DROP CONSTRAINT "_LanguageToProject_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToTechnology" DROP CONSTRAINT "_ProjectToTechnology_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToTechnology" DROP CONSTRAINT "_ProjectToTechnology_B_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "technologies" TEXT[];

-- DropTable
DROP TABLE "CV";

-- DropTable
DROP TABLE "Language";

-- DropTable
DROP TABLE "Technology";

-- DropTable
DROP TABLE "_LanguageToProject";

-- DropTable
DROP TABLE "_ProjectToTechnology";

-- CreateTable
CREATE TABLE "AboutMe" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutMe_pkey" PRIMARY KEY ("id")
);
