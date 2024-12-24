/*
  Warnings:

  - You are about to drop the column `icon` on the `Category` table. All the data in the column will be lost.
  - Added the required column `slug` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "icon";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "metaDesc" TEXT,
ADD COLUMN     "metaKey" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "metaDesc" TEXT,
ADD COLUMN     "metaKey" TEXT,
ADD COLUMN     "metaTitle" TEXT;
