import * as path from "path";
import * as yaml from "yamljs";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "src/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true
    })
  );

  const yamlPath = path.join(__dirname, "../docs/api.yaml");
  const document = yaml.load(yamlPath);

  SwaggerModule.setup("docs", app, document);

  await app.listen(3000);
}

bootstrap().catch((error) => {
  console.error("Application failed to start : ", error);
  process.exit(1);
});
