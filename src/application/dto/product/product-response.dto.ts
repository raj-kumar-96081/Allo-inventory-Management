export interface ProductInventoryDto {
  warehouseId: string;
  warehouseName: string;

  availableQty: number;
  reservedQty: number;
  sellableQty: number;
}

export interface ProductResponseDto {
  id: string;
  sku: string;
  name: string;
  description?: string;

  inventory: ProductInventoryDto[];
}