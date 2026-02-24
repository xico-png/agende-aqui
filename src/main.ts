import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Agende Aqui')
    .setDescription(
      'API para adicionar matérias semestrais e compromissos avulsos no Google Calendar automaticamente.',
    )
    .setVersion('1.0')
    .addTag('auth', 'Autenticação com o Google')
    .addTag('subjects', 'Matérias semestrais com aulas recorrentes')
    .addTag('appointments', 'Compromissos avulsos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 API rodando em http://localhost:${port}`);
  console.log(`📖 Documentação em http://localhost:${port}/docs`);
}
bootstrap();
