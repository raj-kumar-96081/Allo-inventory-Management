import { prisma } from '@/infrastructure/prisma/prisma';

export class PrismaProductRepository {
  async findAll() {
    return prisma.product.findMany({
      include: {
        inventories: {
          include: {
            warehouse: true,
          },
        },
      },
    });
  }
}