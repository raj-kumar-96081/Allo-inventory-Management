import {
  ReservationEntity,
  ReservationStatus,
} from '../entities/reservation.entity';

export interface ReservationRepository {
  create(
    reservation: ReservationEntity,
  ): Promise<ReservationEntity>;

  findById(
    id: string,
  ): Promise<ReservationEntity | null>;

  updateStatus(
    id: string,
    status: ReservationStatus,
  ): Promise<void>;

  findExpiredReservations(): Promise<
    ReservationEntity[]
  >;

  save(
    reservation: ReservationEntity,
  ): Promise<void>;
}