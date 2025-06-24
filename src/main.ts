import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { CORS_CONFIG } from './common/constants';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Express } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  // Configuration du trust proxy pour Express
  const expressInstance = app.getHttpAdapter().getInstance() as Express;
  expressInstance.set('trust proxy', (ip: string) => {
    const trustedProxies = [
      '127.0.0.1',
      '::ffff:172.17.0.1',
      '::1', // Ajouter IPv6 localhost si nécessaire
    ];
    return trustedProxies.includes(ip);
  });

  // Validation et CORS
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors(CORS_CONFIG);
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
