import { InventoryEntity } from '../entities/inventory.entity';

export interface InventoryRepository {
  findByProductAndWarehouse(
    productId: string,
    warehouseId: string,
  ): Promise<InventoryEntity | null>;

  save(
    inventory: InventoryEntity,
  ): Promise<void>;
}