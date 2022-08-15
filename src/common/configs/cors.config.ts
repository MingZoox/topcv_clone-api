import { INestApplication } from "@nestjs/common";

export default function corsConfig(app: INestApplication) {
  app.enableCors({
    origin: ["http://localhost:3000"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    methods: ["POST", "PUT", "GET", "DELETE"],
  });
}
