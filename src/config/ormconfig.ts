import { DataSourceOptions } from 'typeorm';

import { Professional } from '../modules/professional/entities/professional.entity';
import { Patient } from '../modules/patient/entities/patient.entity';
import { Scheduling } from '../modules/scheduling/entities/scheduling.entity';

//CONFIG DO SQLITE - Esse Banco é util para fins de desenvolvimento.
export const config: DataSourceOptions = {
  type: 'sqlite',
  database: './database/database.sqlite',
  synchronize: true,
  logging: true,
  entities: [Professional, Patient, Scheduling],
};

// CONFIG NEON POSTGRESQL - Banco de produção da aplicação.
// const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
// export const config: DataSourceOptions = {
//   type: 'postgres',
//   host: PGHOST,
//   database: PGDATABASE,
//   username: PGUSER,
//   password: PGPASSWORD,
//   port: 5432,
//   ssl: true,
//   synchronize: true,
//   logging: true,
//   entities: [Professional, Patient, Scheduling],
// };

