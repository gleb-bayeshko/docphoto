/*
  Warnings:

  - You are about to drop the column `value` on the `Report` table. All the data in the column will be lost.
  - Added the required column `description` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "value",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
