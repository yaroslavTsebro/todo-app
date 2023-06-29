/*
  Warnings:

  - Made the column `otp` on table `Otp` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Otp_otp_key";

-- AlterTable
ALTER TABLE "Otp" ALTER COLUMN "otp" SET NOT NULL;
