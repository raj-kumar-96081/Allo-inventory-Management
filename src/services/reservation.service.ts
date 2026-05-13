import { apiClient }
  from './api-client';

export async function createReservation(
  payload: {
    productId: string;
    warehouseId: string;
    quantity: number;
  },
) {

  const response =
    await apiClient.post(
      '/reservations',
      payload,

      {
        headers: {
          'Idempotency-Key':
            crypto.randomUUID(),
        },
      },
    );

  return response.data.data;
}

export async function confirmReservation(
  reservationId: string,
) {

  const response =
    await apiClient.post(
      `/reservations/${reservationId}/confirm`,
    );

  return response.data.data;
}

export async function releaseReservation(
  reservationId: string,
) {

  const response =
    await apiClient.post(
      `/reservations/${reservationId}/release`,
    );

  return response.data.data;
}