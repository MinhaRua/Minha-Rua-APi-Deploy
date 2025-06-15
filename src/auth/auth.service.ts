import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from 'src/Usuario/usuario.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/token/token.service';
import { Usuario } from 'src/Usuario/usuario.entity';
import { use } from 'passport';
import { UsuarioCadastrarDto } from 'src/Usuario/dto/usuario.cadastrar.dto';
import { compare, compareSync } from 'bcrypt';



@Injectable()
export class AuthService {
  constructor(private usuarioService: UsuarioService, 
    private jwtService: JwtService,
    private tokenService: TokenService
  ) {}

  async validarUsuario(email: string, senha: string): Promise<any> {
    const usuario = await this.usuarioService.findOne(email);
    if (usuario && !bcrypt.compareSync(senha, usuario.password)) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = usuario;
    // TODO: Generate a JWT and return it here
    // instead of the user object
    return result;
  }

  async login(usuario: any){
    const payload = { sub: usuario.id, username: usuario.email,isAdmin: usuario.isAdmin };
    const token = await this.jwtService.signAsync(payload)
    await this.tokenService.save(token, usuario.email)
    return {
      access_token: token 
    };
  }

  async loginToken(token: string) {
  let usuario: Usuario = await this.tokenService.getUsuarioByToken(token);
  if (usuario) {
    // Aqui você chama a função login que gerará um novo token
    return this.login(usuario);
  } else {
    throw new HttpException({
      errorMessage: 'Token inválido'
    }, HttpStatus.UNAUTHORIZED);
  }
}


   async validateUser(email: string, password: string) {
    const user = await this.usuarioService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found!');
    const isPasswordMatch = await compare(password, user.password);
    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid credentials');

    return { id: user.id };
  }


async validateGoogleUser(googleUser: UsuarioCadastrarDto) {
  let user = await this.usuarioService.findByEmail(googleUser.email);
  if(user){
    return user;
  }
  // Cria e retorna o usuário completo:
  return await this.usuarioService.cadastrar(googleUser);
}
}
