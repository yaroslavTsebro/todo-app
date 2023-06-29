/*
  Warnings:

  - The `frequency` column on the `TaskList` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TaskList" DROP COLUMN "frequency",
ADD COLUMN     "frequency" TIMESTAMP(3)[] DEFAULT ARRAY[]::TIMESTAMP(3)[];
