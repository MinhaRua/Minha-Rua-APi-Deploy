// locations.service.ts
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Locations } from './locations.entity';
import { locationsCadastrarDto } from './dto/locations.cadastrar.dto';
import { Usuario } from 'src/Usuario/usuario.entity';
import { locationsResultadoDto } from './dto/locations.resultado.dto';

@Injectable()
export class LocationsService {
  constructor(
    @Inject('LOCATIONS_REPOSITORY')
    private locationsRepository: Repository<Locations>,
  ) {}

  async listar(): Promise<Locations[]> {
  return this.locationsRepository.find({
    relations: ['usuario'], 
  });
}

  async cadastrar(data: locationsCadastrarDto, usuario: Usuario): Promise<locationsResultadoDto> {
  // Verifica se já existe uma location com a mesma latitude e longitude
  const existente = await this.locationsRepository.findOne({
    where: {
      latitude: data.latitude,
      longitude: data.longitude,
    }
  });

  if (existente) {
    return {
      status: false,
      mensagem: 'Já existe uma location com essa latitude e longitude',
    };
  }

  const locations = new Locations();
  locations.nome = data.nome;
  locations.descricao = data.descricao;
  locations.latitude = data.latitude;
  locations.longitude = data.longitude;
  locations.usuario = usuario;
  locations.endereco = data.endereco;
  locations.foto_local = data.foto_local;
  locations.status = 0; 

  try {
    await this.locationsRepository.save(locations);
    const resultado = await this.locationsRepository.save(locations);
  } catch (error) {
    return { status: false, mensagem: 'Erro ao salvar a location' };
  }
}



async deletar(id: number): Promise<void> {
  await this.locationsRepository.delete(id);
}


async verificarStatus(id: number): Promise<{ status: number; resolvido: boolean }> {
  const local = await this.locationsRepository.findOne({ where: { id } });

  if (!local) {
    return { status: 0, resolvido: false };
  }

  return {
    status: local.status,
    resolvido: local.status === 1,
  };
}

async excluirLocation(id: number): Promise<{ status: boolean; mensagem: string }> {
  try {
    const location = await this.locationsRepository.findOne({ where: { id } });

    if (!location) {
      return { status: false, mensagem: 'Localização não encontrada' };
    }

    await this.locationsRepository.remove(location);

    return { status: true, mensagem: 'Localização excluída com sucesso' };
  } catch (error) {
    return { status: false, mensagem: 'Erro ao excluir localização' };
  }
}


async atualizarStatus(id: number, novoStatus: number): Promise<{ status: boolean; mensagem: string }> {
  const location = await this.locationsRepository.findOne({ where: { id } });

  if (!location) {
    return {
      status: false,
      mensagem: 'Localização não encontrada',
    };
  }

  location.status = novoStatus;
  await this.locationsRepository.save(location);

  return {
    status: true,
    mensagem: novoStatus === 1 ? 'Status atualizado para Concluído' : 'Status atualizado para Em andamento',
  };
}


async listarPorUsuario(usuarioId: number): Promise<Locations[]> {
  return this.locationsRepository.find({
    where: {
      usuario: { id: usuarioId },
    },
    relations: ['usuario'],
    order: { created_at: 'DESC' },
  });
}


async editarLocation(
  id: number,
  usuarioId: number,
  dados: { nome?: string; descricao?: string; foto_local?: string }
): Promise<{ status: boolean; mensagem: string }> {
  const location = await this.locationsRepository.findOne({
    where: { id },
    relations: ['usuario'],
  });

  if (!location) {
    return { status: false, mensagem: 'Localização não encontrada' };
  }

  if (location.usuario.id !== usuarioId) {
    return { status: false, mensagem: 'Você não tem permissão para editar esta localização' };
  }

  // Atualiza apenas os campos permitidos
  if (dados.nome !== undefined) location.nome = dados.nome;
  if (dados.descricao !== undefined) location.descricao = dados.descricao;
  if (dados.foto_local !== undefined) location.foto_local = dados.foto_local;

  try {
    await this.locationsRepository.save(location);
    return { status: true, mensagem: 'Localização atualizada com sucesso' };
  } catch (error) {
    return { status: false, mensagem: 'Erro ao atualizar a localização' };
  }
}

async removerMinhaLocation(id: number, usuarioId: number): Promise<{ status: boolean; mensagem: string }> {
  const location = await this.locationsRepository.findOne({
    where: { id },
    relations: ['usuario'],
  });

  if (!location) {
    throw new HttpException('Localização não encontrada', HttpStatus.NOT_FOUND);
  }

  if (location.usuario.id !== usuarioId) {
    throw new HttpException('Você não tem permissão para excluir esta localização', HttpStatus.FORBIDDEN);
  }

  await this.locationsRepository.remove(location);

  return { status: true, mensagem: 'Localização removida com sucesso' };
}




}
