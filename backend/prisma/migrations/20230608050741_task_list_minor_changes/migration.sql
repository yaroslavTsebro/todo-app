-- DropForeignKey
ALTER TABLE "TaskList" DROP CONSTRAINT "TaskList_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "TaskList" DROP CONSTRAINT "TaskList_groupId_fkey";

-- AlterTable
ALTER TABLE "TaskList" ALTER COLUMN "creatorId" DROP NOT NULL,
ALTER COLUMN "groupId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TaskList" ADD CONSTRAINT "TaskList_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskList" ADD CONSTRAINT "TaskList_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
