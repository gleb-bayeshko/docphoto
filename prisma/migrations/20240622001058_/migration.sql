-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verificationCode" TEXT,
ADD COLUMN     "verificationCodeResendRequestedAt" TIMESTAMP(3);
