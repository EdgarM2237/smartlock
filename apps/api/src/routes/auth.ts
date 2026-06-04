import type { FastifyInstance } from "fastify";
import { registerClient, loginClient } from "../services/auth.service.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (request, reply) => {
    const { name, email, password } = request.body as {
      name: string;
      email: string;
      password: string;
    };

    try {
      const client = await registerClient({ name, email, password });
      return reply.status(201).send({ data: client });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  app.post("/login", async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    try {
      const client = await loginClient({ email, password });

      const accessToken = app.jwt.sign(
        { id: client.id, email: client.email },
        { expiresIn: "15m" }
      );

      const refreshToken = app.jwt.sign(
        { id: client.id },
        { expiresIn: "7d" }
      );

      reply.setCookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth/refresh",
        maxAge: 60 * 60 * 24 * 7,
      });

      return reply.send({
        accessToken,
        user: client,
      });
    } catch (err: any) {
      return reply.status(401).send({ error: err.message });
    }
  });

  app.post("/refresh", async (request, reply) => {
    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) {
      return reply.status(401).send({ error: "No autorizado" });
    }

    try {
      const payload = app.jwt.verify<{ id: string }>(refreshToken);

      const accessToken = app.jwt.sign(
        { id: payload.id },
        { expiresIn: "15m" }
      );

      return reply.send({ accessToken });
    } catch {
      return reply.status(401).send({ error: "Token inválido" });
    }
  });

  app.post("/logout", async (request, reply) => {
    reply.clearCookie("refreshToken", { path: "/api/auth/refresh" });
    return reply.send({ message: "Sesión cerrada" });
  });
}