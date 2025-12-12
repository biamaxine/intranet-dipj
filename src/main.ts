import { NestFactory } from '@nestjs/core';

import { ApiModule } from './api.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiMetadata } from './api.metadata';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);

  const API_METADATA = ApiMetadata.getInstance();
  const config = new DocumentBuilder()
    .setTitle(API_METADATA.TITLE)
    .setDescription(API_METADATA.DESCRIPTION)
    .setVersion(API_METADATA.VERSION)
    .setContact(API_METADATA.AUTHOR, API_METADATA.WEBSITE, API_METADATA.EMAIL)
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(console.error);
