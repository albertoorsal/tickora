import { registerEnumType } from '@nestjs/graphql';
import { TicketPriority } from '../../../generated/prisma';
export { TicketPriority };

registerEnumType(TicketPriority, { name: 'TicketPriority' });
