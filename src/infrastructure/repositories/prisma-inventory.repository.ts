import { prisma } from '@/infrastructure/prisma/prisma';

export class PrismaInventoryRepository {
  async findByProductAndWarehouse(
    productId: string,
    warehouseId: string,
  ) {
    return prisma.inventory.findFirst({
      where: {
        productId,
        warehouseId,
      },
    });
  }
}