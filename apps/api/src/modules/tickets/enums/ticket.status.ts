import { registerEnumType } from '@nestjs/graphql';
import { TicketStatus } from '../../../generated/prisma';
export { TicketStatus };

registerEnumType(TicketStatus, { name: 'TicketStatus' });
