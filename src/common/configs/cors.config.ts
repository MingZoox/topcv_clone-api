import { INestApplication } from "@nestjs/common";

export default function corsConfig(app: INestApplication) {
  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    methods: ["POST", "PUT", "GET", "DELETE"],
  });
}
