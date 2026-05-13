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

import {
  getIdempotency,
  setIdempotency,
} from '@/shared/utils/idempotency';

import {
  ValidationError,
} from '@/shared/errors';

import {
  rateLimit,
} from '@/shared/utils/rate-limit';

const reservationService =
  new ReservationService();

export async function POST(
  request: NextRequest,
) {

  try {

    const idempotencyKey =
      request.headers.get(
        'Idempotency-Key',
      );

    if (!idempotencyKey) {
      throw new ValidationError(
        'Idempotency-Key header required',
      );
    }

    const existingResponse =
      await getIdempotency(
        idempotencyKey,
      );

    if (existingResponse) {
      return successResponse(
        existingResponse,
      );
    }

    const ip =
      request.headers.get(
        'x-forwarded-for',
      ) ?? 'unknown';

    await rateLimit(ip);

    const body =
      await request.json();

    const validatedData =
      createReservationSchema.parse(body);

    const reservation =
      await reservationService
        .createReservation(validatedData);

    await setIdempotency(
      idempotencyKey,
      reservation,
    );

    return successResponse(
      reservation,
      201,
    );

  } catch (error) {

    return handleApiError(error);

  }
}