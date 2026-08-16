/*
  Warnings:

  - You are about to drop the `TicketComment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TicketComment" DROP CONSTRAINT "TicketComment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "TicketComment" DROP CONSTRAINT "TicketComment_ticketId_fkey";

-- DropTable
DROP TABLE "TicketComment";

-- CreateTable
CREATE TABLE "tickets_comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_comments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tickets_comments" ADD CONSTRAINT "tickets_comments_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets_comments" ADD CONSTRAINT "tickets_comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
