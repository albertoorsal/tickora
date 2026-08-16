import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserInput } from '../users/dto/create-user.input';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user,
      accessToken: this.signToken(user.id, user.email, user.role),
    };
  }

  async me(userId: string) {
    return this.usersService.findOne(userId);
  }

  async verify(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired session');
    }
  }

  private signToken(sub: string, email: string, role: JwtPayload['role']) {
    const payload: JwtPayload = { sub, email, role };
    return this.jwtService.sign(payload);
  }
}
