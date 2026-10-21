import { registerEnumType } from '@nestjs/graphql';

export enum TicketOrderField {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  PRIORITY = 'priority',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

registerEnumType(TicketOrderField, { name: 'TicketOrderField' });
registerEnumType(SortDirection, { name: 'SortDirection' });
