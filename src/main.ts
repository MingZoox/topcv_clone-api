import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import swaggerConfig from "./common/configs/swagger.config";
import corsConfig from "./common/configs/cors.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  swaggerConfig(app);
  corsConfig(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT || 8000);
}
bootstrap();
