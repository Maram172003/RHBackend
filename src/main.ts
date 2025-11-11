import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
   const port = Number(process.env.PORT || 4000);
   const app = await NestFactory.create(AppModule, { cors: true });
    app.enableCors({
    origin: ['http://localhost:4200'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.setGlobalPrefix('api');
  

  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const config = new DocumentBuilder()
    .setTitle('hrmanagment')
    .setDescription('Login par email + code + création employés')
    .setVersion('1.0')
    .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'bearer',)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document,{
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(port);
  console.log(`API: http://localhost:${process.env.PORT || 4000}`);
  console.log(`Swagger: http://localhost:${process.env.PORT || 4000}/swagger`);
}
bootstrap();
