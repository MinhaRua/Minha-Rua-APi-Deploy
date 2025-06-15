import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsuarioCadastrarDto } from 'src/Usuario/dto/usuario.cadastrar.dto';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService
    ) {}

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Esta rota inicia o fluxo OAuth, Passport redireciona para o Google
  }

  

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleCallback(@Req() req) {
      const token = await this.authService.login(req.user);
      return token; // ← isso retorna { access_token: '...' }
    }


   @Post('login-google')
  async loginGoogle(@Body() googleUser: UsuarioCadastrarDto) {
    const user = await this.authService.validateGoogleUser(googleUser);
    return await this.authService.login(user);
  }

  
  @Post('login-token')
  async loginComToken(@Body() body: { token: string }) {
    const ticket = await client.verifyIdToken({
      idToken: body.token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email || !payload?.name) {
      throw new UnauthorizedException('Token inválido');
    }

    const googleUser = {
      nome: payload.name,
      email: payload.email,
      foto: payload.picture ?? '',
      password: '', 
    };

    const usuario = await this.authService.validateGoogleUser(googleUser);
    return await this.authService.login(usuario);
  }


}


