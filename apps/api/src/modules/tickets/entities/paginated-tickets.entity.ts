import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/common/dto/paginated.factory';
import { Ticket } from './ticket.entity';

@ObjectType()
export class PaginatedTickets extends Paginated(Ticket) {}
