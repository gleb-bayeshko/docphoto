/*
  Warnings:

  - You are about to drop the `_CameraToLens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CameraToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LensToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Camera` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Lens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CameraToLens" DROP CONSTRAINT "_CameraToLens_A_fkey";

-- DropForeignKey
ALTER TABLE "_CameraToLens" DROP CONSTRAINT "_CameraToLens_B_fkey";

-- DropForeignKey
ALTER TABLE "_CameraToUser" DROP CONSTRAINT "_CameraToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_CameraToUser" DROP CONSTRAINT "_CameraToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_LensToUser" DROP CONSTRAINT "_LensToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_LensToUser" DROP CONSTRAINT "_LensToUser_B_fkey";

-- AlterTable
ALTER TABLE "Camera" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lens" ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_CameraToLens";

-- DropTable
DROP TABLE "_CameraToUser";

-- DropTable
DROP TABLE "_LensToUser";

-- AddForeignKey
ALTER TABLE "Camera" ADD CONSTRAINT "Camera_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lens" ADD CONSTRAINT "Lens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
