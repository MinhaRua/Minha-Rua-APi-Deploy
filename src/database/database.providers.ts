import { DataSource } from 'typeorm';
import { Usuario } from 'src/Usuario/usuario.entity';
import { Locations } from 'src/locations/locations.entity';
import { Token } from 'src/token/token.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'Minharua',
        entities: [Usuario, Locations,Token], 
        synchronize: false,
      });

      return dataSource.initialize();
    },
  },
];