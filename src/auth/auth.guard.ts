import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface JwtPayload {
  sub: number;
  nombre: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: 'llave de token',
      });

      request['user'] = payload;
      return true;
    } catch (e) {
      console.log('Mensaje:', e);
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies?.['token'];
  }
}
