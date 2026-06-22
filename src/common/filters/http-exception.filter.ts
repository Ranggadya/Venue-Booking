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

    const logMessage = `[${request.method}] ${request.url} → ${status}: ${message}`;

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        logMessage,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(logMessage);
    }

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

    if (request.method === 'POST') {
      const formRedirectUrl = this.getFormRedirectUrl(request.url);

      if (formRedirectUrl) {
        request.flash('error', message);
        request.flash('formData', JSON.stringify(request.body ?? {}));
        return response.redirect(formRedirectUrl);
      }
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

  private getFormRedirectUrl(url: string): string | null {
    if (url === '/event-bookings') {
      return '/event-bookings/create';
    }

    const bookingUpdateMatch = url.match(/^\/event-bookings\/(\d+)\/update$/);
    if (bookingUpdateMatch) {
      return `/event-bookings/${bookingUpdateMatch[1]}/edit`;
    }

    const bookingDeleteMatch = url.match(/^\/event-bookings\/(\d+)\/delete$/);
    if (bookingDeleteMatch) {
      return `/event-bookings/${bookingDeleteMatch[1]}`;
    }

    if (url === '/venues') {
      return '/venues/create';
    }

    const venueUpdateMatch = url.match(/^\/venues\/(\d+)\/update$/);
    if (venueUpdateMatch) {
      return `/venues/${venueUpdateMatch[1]}/edit`;
    }

    const venueDeleteMatch = url.match(/^\/venues\/(\d+)\/delete$/);
    if (venueDeleteMatch) {
      return '/venues';
    }

    return null;
  }
}
