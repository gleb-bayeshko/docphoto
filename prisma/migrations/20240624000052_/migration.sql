/*
  Warnings:

  - You are about to drop the column `make` on the `Camera` table. All the data in the column will be lost.
  - You are about to drop the column `make` on the `Lens` table. All the data in the column will be lost.
  - Added the required column `lensId` to the `Camera` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Camera" DROP COLUMN "make",
ADD COLUMN     "lensId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lens" DROP COLUMN "make";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "workPlace" TEXT DEFAULT '';

-- CreateTable
CREATE TABLE "_CameraToLens" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CameraToLens_AB_unique" ON "_CameraToLens"("A", "B");

-- CreateIndex
CREATE INDEX "_CameraToLens_B_index" ON "_CameraToLens"("B");

-- AddForeignKey
ALTER TABLE "_CameraToLens" ADD CONSTRAINT "_CameraToLens_A_fkey" FOREIGN KEY ("A") REFERENCES "Camera"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CameraToLens" ADD CONSTRAINT "_CameraToLens_B_fkey" FOREIGN KEY ("B") REFERENCES "Lens"("id") ON DELETE CASCADE ON UPDATE CASCADE;
