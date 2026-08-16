import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Resolver,
  Query,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AssignTicketAgent } from 'src/modules/tickets/dto/assing-ticket-agent.input';
import { CreateTicketInput } from 'src/modules/tickets/dto/create-ticket.input';
import { UpdateTicketInput } from 'src/modules/tickets/dto/update-ticket.input';
import { Ticket } from 'src/modules/tickets/entities/ticket.entity';
import { TicketsService } from 'src/modules/tickets/tickets.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../users/enums/role';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { TicketStatus } from 'src/generated/prisma';

@Resolver(() => Ticket)
export class TicketsResolver {
  constructor(
    private readonly ticketService: TicketsService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => Ticket)
  createTicket(
    @Args('createTicketInput') createTicketInput: CreateTicketInput,
  ) {
    return this.ticketService.create(createTicketInput);
  }

  @Query(() => [Ticket], { name: 'tickets' })
  findAll() {
    return this.ticketService.findAll();
  }

  @Query(() => Ticket, { name: 'ticket' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.ticketService.findOne(id);
  }

  @Mutation(() => Ticket)
  @UseGuards(JwtAuthGuard)
  updateTicket(
    @CurrentUser() user: JwtPayload,
    @Args('updateTicketInput') updateTicketInput: UpdateTicketInput,
  ) {
    return this.ticketService.update(
      updateTicketInput.id,
      updateTicketInput,
      user,
    );
  }

  @Mutation(() => Ticket)
  removeTicket(@Args('id', { type: () => ID }) id: string) {
    return this.ticketService.remove(id);
  }

  @Mutation(() => Ticket)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.AGENT)
  assignTicket(
    @CurrentUser() user: JwtPayload,
    @Args('assignTicketAgent') assignTicketAgent: AssignTicketAgent,
  ) {
    return this.ticketService.assignTicket(
      assignTicketAgent.id,
      assignTicketAgent.agentId,
      user,
    );
  }

  @Mutation(() => Ticket)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.AGENT)
  changeTicketStatus(
    @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => ID }) id: string,
    @Args('newStatus', { type: () => TicketStatus }) newStatus: TicketStatus,
  ) {
    return this.ticketService.changeTicketStatus(id, newStatus, user);
  }

  @ResolveField(() => User, { nullable: true })
  agent(@Parent() ticket: Ticket) {
    if (!ticket.agentId) {
      return null;
    }
    return this.usersService.findOne(ticket.agentId);
  }
}
