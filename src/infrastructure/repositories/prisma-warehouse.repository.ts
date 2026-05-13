import { prisma } from '@/infrastructure/prisma/prisma';

export class PrismaWarehouseRepository {
  async findAll() {
    return prisma.warehouse.findMany();
  }
}