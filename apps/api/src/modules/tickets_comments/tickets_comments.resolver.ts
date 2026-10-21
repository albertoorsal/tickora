import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Resolver,
  ID,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { CreateTicketCommentInput } from 'src/modules/tickets_comments/dto/create-ticket-comment.input';
import { TicketComments } from 'src/modules/tickets_comments/entities/ticket_comments.entity';
import { TicketsCommentsService } from 'src/modules/tickets_comments/tickets_comments.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { UpdateTicketCommentInput } from 'src/modules/tickets_comments/dto/update-ticket-comment.input';

@Resolver(() => TicketComments)
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsCommentsResolver {
  constructor(
    private readonly ticketCommentsService: TicketsCommentsService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => TicketComments)
  addTicketComment(
    @CurrentUser() user: JwtPayload,
    @Args('createTicketCommentInput')
    createTicketCommentInput: CreateTicketCommentInput,
  ) {
    return this.ticketCommentsService.add(createTicketCommentInput, user);
  }

  @Query(() => [TicketComments], { name: 'ticket_comments' })
  ticketComments(
    @CurrentUser() user: JwtPayload,
    @Args('ticketId', { type: () => ID }) ticketId: string,
  ) {
    return this.ticketCommentsService.findByTicketId(ticketId, user);
  }

  @Mutation(() => TicketComments)
  removeTicketComment(
    @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.ticketCommentsService.remove(id, user);
  }

  @Mutation(() => TicketComments)
  updateTicketComment(
    @CurrentUser() user: JwtPayload,
    @Args('updateTicketCommentInput')
    updateTicketCommentInput: UpdateTicketCommentInput,
  ) {
    return this.ticketCommentsService.update(
      updateTicketCommentInput.id,
      updateTicketCommentInput,
      user,
    );
  }

  @ResolveField(() => User, { nullable: false })
  author(@Parent() ticketComments: TicketComments) {
    if (!ticketComments.authorId) {
      return null;
    }

    return this.usersService.findOne(ticketComments.authorId);
  }
}
