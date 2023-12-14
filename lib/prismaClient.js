import { PrismaClient } from "@prisma/client";

// export const prisma = new PrismaClient();
if (process.env.NODE_ENV === "production") {
  
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
