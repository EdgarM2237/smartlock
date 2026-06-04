import "dotenv/config";
import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { authRoutes } from "./routes/auth.js";

const app = Fastify({ logger: true });

await app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET ?? "fallback_secret_dev",
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
});

await app.register(fastifyCookie);

await app.register(cors, {
  origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
  credentials: true,
});

await app.register(helmet);

await app.register(authRoutes, { prefix: "/api/auth" });

app.get("/health", async () => ({ status: "ok" }));

try {
  await app.listen({ port: 3001, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}