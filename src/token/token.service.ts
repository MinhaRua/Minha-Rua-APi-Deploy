import { Injectable, Inject, HttpException, HttpStatus, forwardRef } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Token } from './token.entity';
import { error } from 'console';
import { UsuarioService } from 'src/Usuario/usuario.service';
import { AuthService } from 'src/auth/auth.service';
import { Usuario } from 'src/Usuario/usuario.entity';

@Injectable()
export class TokenService {
  constructor(
    @Inject('TOKEN_REPOSITORY')
    private TokenRepository: Repository<Token>,
    private usuarioservice: UsuarioService,
    @Inject(forwardRef(()=> AuthService))
    private authService: AuthService
  ) {}

  async save(hash: string,username: string){
        let objToken = await this.TokenRepository.findOne({where: {username: username}})
        if(objToken){
            this.TokenRepository.update(objToken.id,{
              hash: hash
            })
        }else{
          this.TokenRepository.insert({
            hash: hash,
            username: username
          })
        }
       
  }

  async refreshtoken(oldToken: string){
    let objToken = await this.TokenRepository.findOne({where: {hash:oldToken}})
    if(objToken){
      let usuario=  await this.usuarioservice.findOne(objToken.username)
      return this.authService.login(usuario)
    }else{
      return new HttpException({
        errorMessage: 'Toke invalido'
      },HttpStatus.UNAUTHORIZED)
  }
}
  async getUsuarioByToken(token: string): Promise<Usuario>{
     token = token.replace("Bearer","").trim()
    let objToken: Token = await this.TokenRepository.findOne({where: {hash: token}}) 
    if(objToken){
      let usuario=  await this.usuarioservice.findOne(objToken.username)
      return usuario
    }else{
      return null
  }
  }

}