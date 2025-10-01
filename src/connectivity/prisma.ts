import { PrismaClient } from "../../generated/int";
import { PrismaClient as PuffPrisma } from "../../generated/puff";

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export const puffPrisma = new PuffPrisma({
  datasources: {
    db: {
      url: process.env.PUFF_DATABASE_URL,
    },
  },
});
