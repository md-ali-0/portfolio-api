/*
  Warnings:

  - You are about to drop the column `url` on the `AboutMe` table. All the data in the column will be lost.
  - Added the required column `aboutMe` to the `AboutMe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cvUrl` to the `AboutMe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortDescription` to the `AboutMe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AboutMe" DROP COLUMN "url",
ADD COLUMN     "aboutMe" TEXT NOT NULL,
ADD COLUMN     "cvUrl" TEXT NOT NULL,
ADD COLUMN     "shortDescription" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "SourceBack" TEXT,
ADD COLUMN     "SourceFront" TEXT;
