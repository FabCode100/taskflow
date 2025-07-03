import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://192.168.0.6:3001'
    ],
  });

  await app.listen(process.env.PORT ?? 3002, '0.0.0.0');
}
bootstrap();
