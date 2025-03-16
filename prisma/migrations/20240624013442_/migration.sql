/*
  Warnings:

  - Added the required column `make` to the `Camera` table without a default value. This is not possible if the table is not empty.
  - Added the required column `make` to the `Lens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Camera" ADD COLUMN     "make" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lens" ADD COLUMN     "make" TEXT NOT NULL;
