/*
  Warnings:

  - A unique constraint covering the columns `[otp]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "otp" SET DATA TYPE VARCHAR(250);

-- CreateIndex
CREATE UNIQUE INDEX "User_otp_key" ON "User"("otp");
