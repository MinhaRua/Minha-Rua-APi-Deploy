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
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT || '3306'),
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        entities: [Usuario, Locations, Token],
        synchronize: true,
        logging: true,
      });

      return dataSource.initialize();
    },
  },
];