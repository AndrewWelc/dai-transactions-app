import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptons: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'dai-transactions',
  entities: ['dist/**/*/entities/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptons);
export default dataSource;
