import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.isAuthenticated()) {
      return true;
    }

    request.flash('error', 'Silakan login terlebih dahulu');
    throw new UnauthorizedException('Silakan login terlebih dahulu');
  }
}
