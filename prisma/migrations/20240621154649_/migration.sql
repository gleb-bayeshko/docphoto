/*
  Warnings:

  - Added the required column `postCreatedAt` to the `TopPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TopPost" ADD COLUMN     "postCreatedAt" TIMESTAMP(3) NOT NULL;
