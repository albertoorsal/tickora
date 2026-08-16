-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_agentId_fkey";

-- AlterTable
ALTER TABLE "tickets" ALTER COLUMN "agentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
