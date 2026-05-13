import { ReservationStatus }
  from '@/domain/entities/reservation.entity';

export interface ReservationResponseDto {
  id: string;

  productId: string;

  warehouseId: string;

  quantity: number;

  status: ReservationStatus;

  expiresAt: Date;

  createdAt: Date;
}