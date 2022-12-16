/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 	app.enableCors({
  //     origin: 'http://localhost:3000/',
  //     credentials: true,
  //   });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  await app.init();
  const config = app.get(ConfigService);

  const port = config.get<number>('API_PORT');
  await app.listen(port, () => {
    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    );
  });
}

bootstrap();
