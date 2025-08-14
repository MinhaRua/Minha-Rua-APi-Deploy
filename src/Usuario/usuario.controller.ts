import { Body, Controller, Get, HttpException, HttpStatus, Patch, Post, Put, Req, Request, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';
import { Any } from 'typeorm';
import { UsuarioCadastrarDto } from './dto/usuario.cadastrar.dto';
import { UsuarioResultadoDto } from 'src/Dto/usuarioresultado.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GoogleAuthGuard } from 'src/auth/guards/google-auth/google-auth.guard';
import { UsuarioUpdateDto } from './dto/usuario.update.dto';
import { LocationsService } from 'src/locations/locations.service';



@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService, private locationsService: LocationsService,
      private authService: AuthService
  ) {}

    @UseGuards(JwtAuthGuard)
    @Get('listar')
    async listar(@Request() req): Promise<Usuario[]>{
       
        const userEmail = req.user.email;
        
   
        const user = await this.usuarioService.findByEmail(userEmail);
        
     
        return user ? [user] : [];
    }

    @Post('cadastrar')
    async cadastrar(@Body() data: UsuarioCadastrarDto): Promise<Usuario | { status: boolean; mensagem: string }> {
      return this.usuarioService.cadastrar(data);
    }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
       return this.authService.login(req.user);
    }
   
    @Post('login-token')
    async loginToken(@Request() req, @Body() data) {
       return this.authService.loginToken(data.token);
    }



    @UseGuards(GoogleAuthGuard)
    @Get("google/login")
    googleLogin(){
      
    }
   
     @UseGuards(GoogleAuthGuard)
    @Get("google/callback")
    googleCallback(){
      
    }


   @UseGuards(JwtAuthGuard)
   @Get('verificar-cadastro')
   async verificarCadastro(@Req() req) {
   const email = req.user.email; // pegando o email do usuário autenticado
   const usuario = await this.usuarioService.findByEmail(email);

   if (!usuario) {
      return { completo: false, mensagem: 'Usuário não encontrado' };
   }

   // Verifica se CPF e telefone estão preenchidos (não nulos, não vazios)
   const cpfCompleto = usuario.cpf && usuario.cpf.trim() !== '';
   const telefoneCompleto = usuario.telefone && usuario.telefone.trim() !== '';

   const completo = cpfCompleto && telefoneCompleto;

   return { completo };
}



  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateUserInfo(
    @Request() req,
    @Body() updateUserDataDto: UsuarioUpdateDto,
  ) {
    return this.usuarioService.updateUserInfo(req.user.id, updateUserDataDto);
  }

@UseGuards(JwtAuthGuard)
@Get('admin')
async isAdmin(@Request() req) {
  const userId = req.user.id;
  const isAdmin = await this.usuarioService.verificarAdmin(userId);

  return {
    isAdmin: isAdmin,
    mensagem: isAdmin ? 'Usuário é um administrador' : 'Usuário não é um administrador'
  };
}


@UseGuards(JwtAuthGuard)
@Get('avisos')
async verificarAvisos(@Request() req) {
  const userId = req.user.id;
  const resultado = await this.usuarioService.verificarAvisos(userId);
  return resultado;
}


@UseGuards(JwtAuthGuard)
@Post('addAviso')
async adicionarAviso(
  @Req() req,
  @Body() data: { userId: number; locationId: number }
) {
  const isAdmin = await this.usuarioService.verificarAdmin(req.user.id);
  if (!isAdmin) {
    throw new HttpException('Apenas administradores podem adicionar avisos.', HttpStatus.FORBIDDEN);
  }

  const aviso = await this.usuarioService.adicionarAviso(data.userId);

  if (aviso.status && data.locationId) {
    await this.locationsService.deletar(data.locationId);
  }

  return aviso;
}

@UseGuards(JwtAuthGuard)
@Get('admin/usuarios')
async listarTodosUsuarios(@Req() req) {
  const isAdmin = await this.usuarioService.verificarAdmin(req.user.id);
  if (!isAdmin) {
    throw new HttpException('Apenas administradores podem listar usuários.', HttpStatus.FORBIDDEN);
  }

  return this.usuarioService.listarTodosUsuarios();
}

@UseGuards(JwtAuthGuard)
@Get('admin/pesquisar')
async pesquisarUsuarios(@Req() req, @Body() data: { termo: string }) {
  const isAdmin = await this.usuarioService.verificarAdmin(req.user.id);
  if (!isAdmin) {
    throw new HttpException('Apenas administradores podem pesquisar usuários.', HttpStatus.FORBIDDEN);
  }

  return this.usuarioService.pesquisarUsuarios(data.termo);
}

@UseGuards(JwtAuthGuard)
@Post('admin/excluir-usuario')
async excluirUsuario(@Req() req, @Body() data: { userId: number }) {
  const isAdmin = await this.usuarioService.verificarAdmin(req.user.id);
  if (!isAdmin) {
    throw new HttpException('Apenas administradores podem excluir usuários.', HttpStatus.FORBIDDEN);
  }

  return this.usuarioService.excluirUsuario(data.userId);
}

@UseGuards(JwtAuthGuard)
@Post('admin/remover-aviso')
async removerAviso(@Req() req, @Body() data: { userId: number }) {
  const isAdmin = await this.usuarioService.verificarAdmin(req.user.id);
  if (!isAdmin) {
    throw new HttpException('Apenas administradores podem remover avisos.', HttpStatus.FORBIDDEN);
  }

  return this.usuarioService.removerAviso(data.userId);
}

@UseGuards(JwtAuthGuard)
@Post('admin/limpar-avisos')
async limparAvisos(@Req() req, @Body() data: { userId: number }) {
  const isAdmin = await this.usuarioService.verificarAdmin(req.user.id);
  if (!isAdmin) {
    throw new HttpException('Apenas administradores podem limpar avisos.', HttpStatus.FORBIDDEN);
  }

  return this.usuarioService.limparAvisos(data.userId);
}

@UseGuards(JwtAuthGuard)
@Post('excluir-conta')
async excluirMinhaAccount(@Req() req) {
  const userId = req.user.id;
  return this.usuarioService.excluirMinhaAccount(userId);
}

}


