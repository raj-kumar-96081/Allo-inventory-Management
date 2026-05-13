import { ProductResponseDto } from '../dto/product/product-response.dto';

import { PrismaProductRepository }
  from '@/infrastructure/repositories/prisma-product.repository';

export class ProductService {
  constructor(
    private readonly productRepository =
      new PrismaProductRepository(),
  ) {}

  async getProducts():
    Promise<ProductResponseDto[]> {

    const products =
      await this.productRepository.findAll();

    return products.map((product) => ({
      id: product.id,
      sku: product.sku,
      name: product.name,
      description: product.description ?? undefined,

      inventory:
        product.inventories.map((inventory) => ({
          warehouseId:
            inventory.warehouse.id,

          warehouseName:
            inventory.warehouse.name,

          availableQty:
            inventory.availableQty,

          reservedQty:
            inventory.reservedQty,

          sellableQty:
            inventory.availableQty -
            inventory.reservedQty,
        })),
    }));
  }
}