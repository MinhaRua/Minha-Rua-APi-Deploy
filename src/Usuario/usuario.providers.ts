import { DataSource } from 'typeorm';
import { Usuario } from './usuario.entity';

export const UsuarioProviders = [
  {
    provide: 'USUARIO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Usuario),
    inject: ['DATA_SOURCE'],
  },
];