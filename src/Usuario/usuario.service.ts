import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { UsuarioCadastrarDto } from './dto/usuario.cadastrar.dto';
import { UsuarioResultadoDto } from 'src/Dto/usuarioresultado.dto';
import * as bcrypt from 'bcrypt';
import { UsuarioUpdateDto } from './dto/usuario.update.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @Inject('USUARIO_REPOSITORY')
    private UsuarioRepository: Repository<Usuario>,
  ) {}

  async listar(): Promise<Usuario[]> {
    return this.UsuarioRepository.find();
  }

async cadastrar(data: UsuarioCadastrarDto): Promise<Usuario | { status: boolean; mensagem: string }> {
  const existe = await this.UsuarioRepository.findOne({
    where: [
      { email: data.email },
      { cpf: data.cpf },
      { telefone: data.telefone },
    ]
  });

  if (existe) {
    return {
      status: false,
      mensagem: 'Email, CPF ou telefone já cadastrados',
    };
  }

  let usuario = new Usuario();
  usuario.nome = data.nome;
  usuario.email = data.email;
  usuario.password = bcrypt.hashSync(data.password, 8);
  usuario.cpf = data.cpf;
  usuario.telefone = data.telefone;
  usuario.foto = data.foto;

  return this.UsuarioRepository.save(usuario);
}

  async findOne(email: string): Promise<Usuario | undefined> {
    const usuarios = await this.UsuarioRepository.find();
    return usuarios.find(usuario => usuario.email === email);
  }



  async findByEmail(email: string): Promise<Usuario | undefined> {
    return this.UsuarioRepository.findOne({ where: { email } });
  }


  
async updateUserInfo(id: number, data: UsuarioUpdateDto): Promise<{ status: boolean; mensagem: string }> {
  try {
    const mensagensErro: string[] = [];

    const cpfExistente = await this.UsuarioRepository.findOne({
      where: { cpf: data.cpf },
    });
    if (cpfExistente && cpfExistente.id !== id) {
      mensagensErro.push('CPF já cadastrado');
    }

    const telefoneExistente = await this.UsuarioRepository.findOne({
      where: { telefone: data.telefone },
    });
    if (telefoneExistente && telefoneExistente.id !== id) {
      mensagensErro.push('Telefone já cadastrado');
    }

    if (mensagensErro.length > 0) {
      return {
        status: false,
        mensagem: mensagensErro.join(' e '),
      };
    }

    await this.UsuarioRepository.update(id, data);
    return {
      status: true,
      mensagem: 'Dados atualizados com sucesso',
    };
  } catch (error) {
    return {
      status: false,
      mensagem: 'Erro ao atualizar os dados',
    };
  }
}

async verificarAdmin(userId: number): Promise<boolean> {
    const usuario = await this.UsuarioRepository.findOne({ where: { id: userId } });
    if (!usuario) {
      return false;
    }
    return usuario.isAdmin === 1;
  }

  async verificarAvisos(userId: number): Promise<{ 
    status: boolean; 
    mensagem: string; 
    avisos: number; 
    permitido: boolean 
  }> {
    const usuario = await this.UsuarioRepository.findOne({ where: { id: userId } });
    
    if (!usuario) {
      return { 
        status: false, 
        mensagem: 'Usuário não encontrado', 
        avisos: 0, 
        permitido: false 
      };
    }
    
    const permitido = usuario.avisos < 3;
    
    return { 
      status: true, 
      mensagem: permitido ? `Usuário possui ${usuario.avisos} aviso(s)` : 'Usuário bloqueado por excesso de avisos', 
      avisos: usuario.avisos, 
      permitido: permitido 
    };
  }

async adicionarAviso(userId: number): Promise<{
    status: boolean;
    mensagem: string;
    avisos: number;
    bloqueado: boolean;
  }> {
    try {
      const usuario = await this.UsuarioRepository.findOne({ where: { id: userId } });
      
      if (!usuario) {
        return {
          status: false,
          mensagem: 'Usuário não encontrado',
          avisos: 0,
          bloqueado: false
        };
      }
      
      // Incrementa o contador de avisos
      usuario.avisos += 1;
      await this.UsuarioRepository.save(usuario);
      
      const bloqueado = usuario.avisos >= 3;
      
      return {
        status: true,
        mensagem: bloqueado 
          ? `Aviso adicionado. Usuário bloqueado por atingir ${usuario.avisos} avisos.` 
          : `Aviso adicionado. Usuário possui agora ${usuario.avisos} aviso(s).`,
        avisos: usuario.avisos,
        bloqueado: bloqueado
      };
    } catch (error) {
      return {
        status: false,
        mensagem: 'Erro ao adicionar aviso ao usuário',
        avisos: 0,
        bloqueado: false
      };
    }
  }
}