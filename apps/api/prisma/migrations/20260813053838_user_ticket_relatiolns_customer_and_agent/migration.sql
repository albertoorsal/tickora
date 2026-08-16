/*
  Warnings:

  - You are about to drop the column `userId` on the `tickets` table. All the data in the column will be lost.
  - Added the required column `agentId` to the `tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_userId_fkey";

-- DropIndex
DROP INDEX "tickets_userId_idx";

-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "userId",
ADD COLUMN     "agentId" TEXT NOT NULL,
ADD COLUMN     "customerId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "tickets_customerId_idx" ON "tickets"("customerId");

-- CreateIndex
CREATE INDEX "tickets_agentId_idx" ON "tickets"("agentId");

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
