import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const options = new DocumentBuilder()
        .setTitle('FLITDESK')
        .setDescription('Back for the application FlitDesk')
        .setVersion('1.0')
        .setBasePath('api')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);
    app.enableCors();
    app.setGlobalPrefix('/api');
    await app.listen(3000);
}

bootstrap();
