import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { LoggingMiddleware } from './middlewares/logging.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // create instances of the middleware classes
  const loggingMiddleware = new LoggingMiddleware();
  app.use(loggingMiddleware.use.bind(loggingMiddleware));

  // add global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // set up Swagger
  const config = new DocumentBuilder()
    .setTitle('Dai Transactions APP')
    .setDescription('API that interacts with the DAI smart contract')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
      },
      'x-api-key',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
