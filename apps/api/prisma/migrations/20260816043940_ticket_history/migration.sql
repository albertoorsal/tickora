-- CreateTable
CREATE TABLE "ticket_history" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "userIdHistory" TEXT,
    "action" TEXT NOT NULL,
    "fromValue" TEXT NOT NULL,
    "toValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ticket_history_ticketId_idx" ON "ticket_history"("ticketId");

-- CreateIndex
CREATE INDEX "ticket_history_userIdHistory_idx" ON "ticket_history"("userIdHistory");

-- AddForeignKey
ALTER TABLE "ticket_history" ADD CONSTRAINT "ticket_history_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_history" ADD CONSTRAINT "ticket_history_userIdHistory_fkey" FOREIGN KEY ("userIdHistory") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
