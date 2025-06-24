export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  type: string;
  timezone: string;
  typeormSync: boolean;
}

export enum NodeEnv {
  Dev = 'development',
  Prod = 'production',
}

export interface EnvironmentVariables {
  nodeEnv: NodeEnv;
  jwtSecret: string;
  jwtRefreshSecret: string;
  database: DatabaseConfig;
}

export default (): EnvironmentVariables => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!jwtSecret) {
    throw new Error('Jwt secret is not set in env');
  }

  if (!jwtRefreshSecret) {
    throw new Error('Jwt refresh secret is not set in env');
  }

  return {
    nodeEnv: process.env.NODE_ENV === NodeEnv.Prod ? NodeEnv.Prod : NodeEnv.Dev,
    jwtSecret,
    jwtRefreshSecret,
    database: {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USER || 'username',
      password: process.env.DATABASE_PASSWORD || 'password',
      database: process.env.DATABASE_NAME || 'dbname',
      timezone: process.env.DB_TIMEZONE || 'UTC',
      type: process.env.DATABASE_TYPE || 'type',
      typeormSync: process.env.DB_TYPEORM_SYNC === 'true',
    },
  };
};
