-- CreateEnum
CREATE TYPE "SiteRole" AS ENUM ('viewer', 'photopgrapher');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "siteRole" "SiteRole" NOT NULL DEFAULT 'viewer';
