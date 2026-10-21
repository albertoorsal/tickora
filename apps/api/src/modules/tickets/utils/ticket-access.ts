import { ForbiddenException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { Role } from 'src/modules/users/enums/role';

type TicketOwnership = { customerId: string; agentId: string | null };

// Tickets a user is allowed to see:
// CUSTOMER -> own tickets, AGENT -> assigned to them or unassigned, ADMIN -> all
export function ticketScopeFor(user: JwtPayload): Prisma.TicketWhereInput {
  switch (user.role) {
    case Role.CUSTOMER:
      return { customerId: user.sub };
    case Role.AGENT:
      return { OR: [{ agentId: user.sub }, { agentId: null }] };
    default:
      return {};
  }
}

export function canViewTicket(ticket: TicketOwnership, user: JwtPayload) {
  switch (user.role) {
    case Role.CUSTOMER:
      return ticket.customerId === user.sub;
    case Role.AGENT:
      return ticket.agentId === null || ticket.agentId === user.sub;
    default:
      return true;
  }
}

export function assertCanView(ticket: TicketOwnership, user: JwtPayload) {
  if (!canViewTicket(ticket, user)) {
    throw new ForbiddenException('You do not have access to this ticket');
  }
}
