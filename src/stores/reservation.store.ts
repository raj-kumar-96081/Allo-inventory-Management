// import { create }
//   from 'zustand';

// interface Reservation {
//   reservationId: string;

//   productId: string;

//   warehouseId: string;

//   quantity: number;

//   expiresAt: string;
// }

// interface ReservationState {
//   reservations: Reservation[];

//   setReservations: (
//     reservations: Reservation[],
//   ) => void;

//   clearReservations: () => void;
// }

// export const useReservationStore =
//   create<ReservationState>(
//     (set) => ({

//       reservations: [],

//       setReservations:
//         (reservations) =>
//           set({
//             reservations,
//           }),

//       clearReservations: () =>
//         set({
//           reservations: [],
//         }),
//     }),
//   );

import { create }
  from 'zustand';

interface ReservationState {
  reservationId?: string;

  expiresAt?: string;

  setReservation: (
    reservationId: string,
    expiresAt: string,
  ) => void;

  clearReservation: () => void;
}

export const useReservationStore =
  create<ReservationState>(
    (set) => ({

      reservationId: undefined,

      expiresAt: undefined,

      setReservation:
        (
          reservationId,
          expiresAt,
        ) =>
          set({
            reservationId,
            expiresAt,
          }),

      clearReservation: () =>
        set({
          reservationId:
            undefined,

          expiresAt:
            undefined,
        }),
    }),
  );