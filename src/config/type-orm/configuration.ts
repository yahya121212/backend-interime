import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { NodeEnv } from '../configuration';
dotenv.config();

const isDevEnv = process.env.NODE_ENV !== NodeEnv.Prod;
const dbHost = process.env.DATABASE_HOST;
const dbUsername = process.env.DATABASE_USER;
const dbPassword = process.env.DATABASE_PASSWORD;
const dbName = process.env.DATABASE_NAME;

export default new DataSource({
  type: 'postgres',
  host: dbHost,
  port: 5432,
  username: dbUsername,
  password: dbPassword,
  database: dbName,
  entities: [isDevEnv ? 'src/**/entities/*.ts' : 'dist/**/entities/*.js'],
  migrations: [isDevEnv ? 'src/migrations/*.ts' : 'dist/migrations/*.js'],
});
