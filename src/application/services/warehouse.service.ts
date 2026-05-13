// import { PrismaWarehouseRepository }
//   from '@/infrastructure/repositories/prisma-warehouse.repository';

// export class WarehouseService {
//   constructor(
//     private readonly warehouseRepository =
//       new PrismaWarehouseRepository(),
//   ) {}

//   async getWarehouses() {
//     return this.warehouseRepository.findAll();
//   }
// }

import { WarehouseResponseDto }
  from '../dto/warehouse/warehouse-response.dto';

import { PrismaWarehouseRepository }
  from '@/infrastructure/repositories/prisma-warehouse.repository';

export class WarehouseService {
  constructor(
    private readonly warehouseRepository =
      new PrismaWarehouseRepository(),
  ) {}

  async getWarehouses():
    Promise<WarehouseResponseDto[]> {

    const warehouses =
      await this.warehouseRepository.findAll();

    return warehouses.map((warehouse) => ({
      id: warehouse.id,
      code: warehouse.code,
      name: warehouse.name,
      city: warehouse.city,
      createdAt: warehouse.createdAt,
      updatedAt: warehouse.updatedAt,
    }));
  }
}