import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import googleAuthConfig from 'config/google-auth.config';


import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google.strategy';
import { TokenModule } from 'src/token/token.module';
import { UsuarioModule } from 'src/Usuario/usuario.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // Importa .env globalmente
    forwardRef(() => UsuarioModule),            // Importa UsuarioModule com forwardRef por dependência circular
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    TokenModule,
    ConfigModule.forFeature(googleAuthConfig),  // Configuração googleOAuth
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
  controllers: [AuthController],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
