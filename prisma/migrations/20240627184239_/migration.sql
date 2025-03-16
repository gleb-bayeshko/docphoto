-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "reportId" TEXT;

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE SET NULL ON UPDATE CASCADE;
