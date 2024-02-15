import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class CustomJwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token not provided');
    }

    const token = authorizationHeader.split(' ')[1];
    try {
      const decryptedToken = await this.authService.decryptToken(token);
      request.user = decryptedToken;
      return true;
    } catch (error) {
      console.error('Error in CustomJwtAuthGuard:', error); // Log para depuração
      throw new UnauthorizedException('Invalid token');
    }
  }
}
