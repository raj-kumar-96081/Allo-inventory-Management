import { ProductResponseDto } from '../dto/product/product-response.dto';

import {
  getCache,
  setCache,
} from '@/infrastructure/redis/cache';

import { PrismaProductRepository }
  from '@/infrastructure/repositories/prisma-product.repository';

export class ProductService {
  constructor(
    private readonly productRepository =
      new PrismaProductRepository(),
  ) { }

  async getProducts():
    Promise<ProductResponseDto[]> {

    const cacheKey =
      'inventory:products';

    const cachedProducts =
      await getCache<ProductResponseDto[]>(
        cacheKey,
      );

    if (cachedProducts) {
      return cachedProducts;
    }

    const products =
      await this.productRepository.findAll();

    const transformedProducts = products.map((product) => ({
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

    await setCache(
      cacheKey,
      transformedProducts,
      60,
    );

    return transformedProducts;
  }
}