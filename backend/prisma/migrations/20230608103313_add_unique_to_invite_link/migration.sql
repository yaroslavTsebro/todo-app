/*
  Warnings:

  - A unique constraint covering the columns `[inviteLink]` on the table `Group` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Group_inviteLink_key" ON "Group"("inviteLink");
