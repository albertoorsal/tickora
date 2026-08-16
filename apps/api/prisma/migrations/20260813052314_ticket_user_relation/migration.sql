/*
  Warnings:

  - Added the required column `userId` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "tickets_userId_idx" ON "tickets"("userId");

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
