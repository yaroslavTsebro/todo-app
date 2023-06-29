/*
  Warnings:

  - Made the column `creatorId` on table `TaskList` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "TaskList" DROP CONSTRAINT "TaskList_creatorId_fkey";

-- AlterTable
ALTER TABLE "TaskList" ALTER COLUMN "creatorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "TaskList" ADD CONSTRAINT "TaskList_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
