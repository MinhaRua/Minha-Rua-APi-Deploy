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
        host: process.env.MYSQLHOST, // OK
        port: parseInt(process.env.MYSQLPORT || '3306'),
        username: process.env.MYSQLUSER,
        password: process.env.MYSQLPASSWORD,
        database: process.env.MYSQLDATABASE,
        entities: [Usuario, Locations, Token],
        synchronize: true,
        logging: true,
      });

      return dataSource.initialize();
    },
  },
];