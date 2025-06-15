import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validarUsuario(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

validate1(email: string, password: string) {
        if (password === "") {
            throw new UnauthorizedException("A senha por favor");
        }
        return this.authService.validateUser(email, password);
    }
}