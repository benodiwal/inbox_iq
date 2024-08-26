import { PrismaClient } from "@prisma/client";

const prisma = new  PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Database connection successful.');
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

export default prisma;
