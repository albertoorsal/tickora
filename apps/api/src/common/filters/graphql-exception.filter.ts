import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { GraphQLError } from 'graphql';

@Catch(HttpException)
export class GraphQLExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, _host: ArgumentsHost) {
    const response = exception.getResponse();
    const message =
      typeof response === 'string'
        ? response
        : ((response as { message?: string | string[] }).message ??
          exception.message);

    return new GraphQLError(Array.isArray(message) ? message.join(', ') : message, {
      extensions: {
        code: exception.constructor.name,
        status: exception.getStatus(),
      },
    });
  }
}
