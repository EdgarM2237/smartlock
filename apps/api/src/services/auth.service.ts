import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

export async function registerClient(data: {
  name: string;
  email: string;
  password: string;
}) {
  const exists = await prisma.client.findUnique({
    where: { email: data.email },
  });

  if (exists) {
    throw new Error("El correo ya está registrado");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const client = await prisma.client.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return client;
}

export async function loginClient(data: {
  email: string;
  password: string;
}) {
  const client = await prisma.client.findUnique({
    where: { email: data.email },
  });

  if (!client) {
    throw new Error("Credenciales incorrectas");
  }

  const valid = await bcrypt.compare(data.password, client.passwordHash);

  if (!valid) {
    throw new Error("Credenciales incorrectas");
  }

  return {
    id: client.id,
    name: client.name,
    email: client.email,
  };
}