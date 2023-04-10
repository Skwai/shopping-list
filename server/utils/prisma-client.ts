import { PrismaClient } from "@prisma/client";
import { isDevEnv } from "./env";

let prisma: PrismaClient;

export const getPrismaClient = () => {
  prisma ??= new PrismaClient({
    log: isDevEnv() ? ["query"] : [],
  });

  return prisma;
};
