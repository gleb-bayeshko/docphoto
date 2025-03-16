-- DropForeignKey
ALTER TABLE "TopPost" DROP CONSTRAINT "TopPost_postId_fkey";

-- DropIndex
DROP INDEX "TopPost_postId_key";

-- AddForeignKey
ALTER TABLE "TopPost" ADD CONSTRAINT "TopPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
