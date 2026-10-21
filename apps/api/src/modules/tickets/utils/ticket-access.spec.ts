import { ForbiddenException } from '@nestjs/common';
import { Role } from 'src/modules/users/enums/role';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { assertCanView, ticketScopeFor } from './ticket-access';

const user = (role: Role, sub = 'user-1'): JwtPayload => ({
  sub,
  email: `${sub}@tickora.test`,
  role,
});

describe('ticket-access', () => {
  describe('ticketScopeFor', () => {
    it('limits customers to their own tickets', () => {
      expect(ticketScopeFor(user(Role.CUSTOMER))).toEqual({
        customerId: 'user-1',
      });
    });

    it('limits agents to assigned or unassigned tickets', () => {
      expect(ticketScopeFor(user(Role.AGENT))).toEqual({
        OR: [{ agentId: 'user-1' }, { agentId: null }],
      });
    });

    it('does not limit admins', () => {
      expect(ticketScopeFor(user(Role.ADMIN))).toEqual({});
    });
  });

  describe('assertCanView', () => {
    const ticket = { customerId: 'customer-1', agentId: 'agent-1' };

    it('allows the ticket customer', () => {
      expect(() =>
        assertCanView(ticket, user(Role.CUSTOMER, 'customer-1')),
      ).not.toThrow();
    });

    it('forbids another customer', () => {
      expect(() =>
        assertCanView(ticket, user(Role.CUSTOMER, 'customer-2')),
      ).toThrow(ForbiddenException);
    });

    it('allows the assigned agent and forbids other agents', () => {
      expect(() =>
        assertCanView(ticket, user(Role.AGENT, 'agent-1')),
      ).not.toThrow();
      expect(() => assertCanView(ticket, user(Role.AGENT, 'agent-2'))).toThrow(
        ForbiddenException,
      );
    });

    it('allows any agent on an unassigned ticket', () => {
      expect(() =>
        assertCanView(
          { customerId: 'customer-1', agentId: null },
          user(Role.AGENT, 'agent-2'),
        ),
      ).not.toThrow();
    });

    it('allows admins', () => {
      expect(() => assertCanView(ticket, user(Role.ADMIN))).not.toThrow();
    });
  });
});
