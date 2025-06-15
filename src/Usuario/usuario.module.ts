import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import googleAuthConfig from 'config/google-auth.config';
import { DatabaseModule } from '../database/database.module';
import { UsuarioProviders } from './usuario.providers';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { AuthModule } from 'src/auth/auth.module';
import { GoogleStrategy } from 'src/auth/google.strategy';
import { LocationsModule } from 'src/locations/locations.module'; // Ajuste o caminho conforme necessário

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => AuthModule),
    ConfigModule.forFeature(googleAuthConfig),
    LocationsModule, // Adiciona o módulo que exporta LocationsService
  ],
  controllers: [UsuarioController],
  providers: [
    ...UsuarioProviders,
    UsuarioService,
    GoogleStrategy,
  ],
  exports: [UsuarioService],
})
export class UsuarioModule {}
