-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "assignedByUserId" TEXT;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_assignedByUserId_fkey" FOREIGN KEY ("assignedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
