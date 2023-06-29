/*
  Warnings:

  - You are about to drop the column `dates` on the `TaskList` table. All the data in the column will be lost.
  - You are about to drop the `TaskItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TaskItem" DROP CONSTRAINT "TaskItem_taskListId_fkey";

-- AlterTable
ALTER TABLE "TaskList" DROP COLUMN "dates",
ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "frequency" INTEGER;

-- DropTable
DROP TABLE "TaskItem";

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "taskListId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_taskListId_fkey" FOREIGN KEY ("taskListId") REFERENCES "TaskList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
