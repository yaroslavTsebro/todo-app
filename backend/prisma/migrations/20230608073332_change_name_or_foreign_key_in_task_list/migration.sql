/*
  Warnings:

  - You are about to drop the column `creatorId` on the `TaskList` table. All the data in the column will be lost.
  - Added the required column `userId` to the `TaskList` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TaskList" DROP CONSTRAINT "TaskList_creatorId_fkey";

-- AlterTable
ALTER TABLE "TaskList" DROP COLUMN "creatorId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "TaskList" ADD CONSTRAINT "TaskList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
