import { DataSource } from 'typeorm';
import { Usuario } from 'src/Usuario/usuario.entity';
import { Locations } from 'src/locations/locations.entity';
import { Token } from 'src/token/token.entity';
/* import * as dotenv from 'dotenv';

dotenv.config(); */

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        url: process.env.MYSQL_URL, // Usa a URL completa de conexão
        entities: [Usuario, Locations, Token],
        synchronize: true,
        logging: true,
      });

      return dataSource.initialize();
    },
  },
];