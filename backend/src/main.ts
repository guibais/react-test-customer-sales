import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();

  await app.listen(process.env.PORT ?? 9198);
}

if (require.main === module) {
  bootstrap().catch((error) => {
    console.error('Application failed to start:', error);
    process.exit(1);
  });
}
