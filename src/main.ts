import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import morgan from 'morgan';

import { ApiMetadata } from './api.metadata';
import { ApiModule } from './api.module';
import { ClearCacheMiddleware } from './shared/middlewares/clear-cache.middleware';

async function bootstrap() {
  const api = await NestFactory.create(ApiModule);

  api.use(ClearCacheMiddleware.use);

  const API_METADATA = ApiMetadata.getInstance();
  const config = new DocumentBuilder()
    .setTitle(API_METADATA.TITLE)
    .setDescription(API_METADATA.DESCRIPTION)
    .setVersion(API_METADATA.VERSION)
    .setContact(API_METADATA.AUTHOR, API_METADATA.WEBSITE, API_METADATA.EMAIL)
    .build();
  const documentFactory = () => SwaggerModule.createDocument(api, config);
  SwaggerModule.setup('api', api, documentFactory);

  api.use(morgan('dev'));

  await api.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(console.error);
