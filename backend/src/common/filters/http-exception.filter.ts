import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

// ─── HttpExceptionFilter ──────────────────────────────────────────────────────
// Captura TODAS las excepciones HTTP y devuelve una respuesta consistente.
// Sin esto, NestJS devuelve formatos distintos según el tipo de error.
// Con esto, SIEMPRE tendrás: { statusCode, message, error, timestamp, path }
//
// El frontend puede depender de este contrato para manejar errores.
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const message =
      typeof exceptionResponse === 'object' && 'message' in exceptionResponse
        ? (exceptionResponse as { message: string | string[] }).message
        : exception.message;

    const errorBody: ErrorResponse = {
      statusCode,
      message,
      error: HttpStatus[statusCode] ?? 'Error',
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Log solo errores 5xx (errores del servidor, no del cliente)
    if (statusCode >= 500) {
      this.logger.error(`${request.method} ${request.url}`, exception.stack);
    }

    response.status(statusCode).json(errorBody);
  }
}
