import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTodoInput: CreateTodoInput) {
    return this.prisma.todo.create({ data: createTodoInput });
  }

  findAll() {
    return this.prisma.todo.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const todo = await this.prisma.todo.findUnique({ where: { id } });

    if (!todo) {
      throw new NotFoundException(`Todo with id "${id}" not found`);
    }

    return todo;
  }

  async update(updateTodoInput: UpdateTodoInput) {
    const { id, ...data } = updateTodoInput;
    await this.findOne(id);

    return this.prisma.todo.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.todo.delete({ where: { id } });
  }
}
