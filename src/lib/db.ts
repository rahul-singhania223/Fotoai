import { PrismaClient } from "@/generated/prisma";

declare global {
  interface GlobalThis {
    prisma?: PrismaClient;
  }
}

const globalForPrisma = globalThis as GlobalThis;

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
