export class InventoryEntity {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly warehouseId: string,
    public availableQty: number,
    public reservedQty: number,
  ) {}

  get sellableQty() {
    return this.availableQty - this.reservedQty;
  }
}