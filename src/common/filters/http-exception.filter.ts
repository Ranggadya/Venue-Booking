import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status: HttpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? this.extractMessage(exception)
        : 'Terjadi kesalahan pada server';

    this.logger.error(
      `[${request.method}] ${request.url} → ${status}: ${message}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    const isApiRequest = request.url.startsWith('/api/');

    if (response.headersSent) {
      return;
    }

    if (isApiRequest) {
      return response.status(status).json({
        statusCode: status,
        message,
        error: this.getErrorName(status),
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    }

    if (status === HttpStatus.UNAUTHORIZED) {
      return response.redirect('/login');
    }

    if (status === HttpStatus.NOT_FOUND) {
      return response.status(status).render('errors/404', {
        layout: false,
        title: '404 — Halaman Tidak Ditemukan',
        message,
        url: request.url,
      });
    }

    return response.status(status).render('errors/500', {
      layout: false,
      title: '500 — Internal Server Error',
      message,
      status,
    });
  }

  private extractMessage(exception: HttpException): string {
    const response = exception.getResponse();

    if (typeof response === 'string') {
      return response;
    }

    if (typeof response === 'object' && response !== null) {
      const res = response as Record<string, unknown>;
      if (Array.isArray(res.message) && res.message.length > 0) {
        return String(res.message[0]);
      }
      if (typeof res.message === 'string') {
        return res.message;
      }
    }

    return exception.message;
  }

  private getErrorName(status: number): string {
    const map: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      500: 'Internal Server Error',
    };
    return map[status] ?? 'Error';
  }
}
