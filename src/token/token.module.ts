import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { TokenProviders } from './token.providers';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { UsuarioModule } from 'src/Usuario/usuario.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => AuthModule),  // Usando forwardRef para evitar circularidade com AuthModule
    forwardRef(() => UsuarioModule),  // Usando forwardRef para evitar circularidade com UsuarioModule
  ],
  controllers: [TokenController],
  providers: [
    ...TokenProviders,
    TokenService,
  ],
  exports: [TokenService],  // Exporta o TokenService para uso em outros módulos
})
export class TokenModule {}
