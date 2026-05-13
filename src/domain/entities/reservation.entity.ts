export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  RELEASED = 'RELEASED',
  EXPIRED = 'EXPIRED',
}

export class ReservationEntity {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly warehouseId: string,
    public readonly quantity: number,
    public status: ReservationStatus,
    public expiresAt: Date,
  ) {}

  isExpired() {
    return new Date() > this.expiresAt;
  }
}