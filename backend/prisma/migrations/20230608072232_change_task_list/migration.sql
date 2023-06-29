/*
  Warnings:

  - You are about to drop the column `endsAt` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `startsAt` on the `Task` table. All the data in the column will be lost.
  - The `frequency` column on the `TaskList` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "endsAt",
DROP COLUMN "startsAt",
ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 60;

-- AlterTable
ALTER TABLE "TaskList" DROP COLUMN "frequency",
ADD COLUMN     "frequency" JSONB[];
