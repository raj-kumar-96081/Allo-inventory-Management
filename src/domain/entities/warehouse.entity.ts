export class WarehouseEntity {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly name: string,
    public readonly city: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}