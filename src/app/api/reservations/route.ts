import { NextRequest }
  from 'next/server';

import { ReservationService }
  from '@/modules/reservation/services/reservation.service';

import { handleApiError }
  from '@/shared/utils/handle-api-error';

import { successResponse }
  from '@/shared/response/success-response';

import {
  createReservationSchema,
} from '@/validators/reservation.validator';

const reservationService =
  new ReservationService();

export async function POST(
  request: NextRequest,
) {

  try {

    const body =
      await request.json();

    const validatedData =
      createReservationSchema.parse(body);

    const reservation =
      await reservationService
        .createReservation(validatedData);

    return successResponse(
      reservation,
      201,
    );

  } catch (error) {

    return handleApiError(error);

  }
}