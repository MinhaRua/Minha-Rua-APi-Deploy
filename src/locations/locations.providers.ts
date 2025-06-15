import { DataSource } from 'typeorm';
import { Locations } from './locations.entity';


export const LocationsProviders = [
  {
    provide: 'LOCATIONS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Locations),
    inject: ['DATA_SOURCE'],
  },
];