import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService,private authService: AuthService) {
    super({
      clientID: configService.get<string>('googleOAuth.clientId'),
      clientSecret: configService.get<string>('googleOAuth.clientSecret'),
      callbackURL: configService.get<string>('googleOAuth.callbackURL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };

    // Aqui você pode verificar se o usuário existe no banco
    // e criar um novo registro, ou atualizar os dados.
    console.log('User data processed:', user);
                                                                                                           
        const user1 = await this.authService.validateGoogleUser({
            email: profile.emails[0].value,
            nome: `${profile.name.givenName} ${profile.name.familyName}`,
            foto: profile.photos[0].value,
            password: ""
        });
           done(null, user1); // retorna os dados do usuário autenticado para o Passport
  }


}
