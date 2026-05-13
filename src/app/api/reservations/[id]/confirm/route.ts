import { NextRequest }
  from 'next/server';

import { ReservationService }
  from '@/modules/reservation/services/reservation.service';

import { successResponse }
  from '@/shared/response/success-response';

import { handleApiError }
  from '@/shared/utils/handle-api-error';

const reservationService =
  new ReservationService();

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {

  try {

    const { id } =
      await context.params;

    const result =
      await reservationService
        .confirmReservation(id);

    return successResponse(result);

  } catch (error) {

    return handleApiError(error);

  }
}