import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as express from "express"
import { join } from "path"

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({ credentials: true, origin: true })
  app.use("/uploads", express.static(join(__dirname, "..", "uploads")))
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle("Облачное хранилище")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup("docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true
    }
  });

  await app.listen(4200);
}
bootstrap();
