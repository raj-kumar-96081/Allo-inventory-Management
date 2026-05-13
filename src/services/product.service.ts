import { apiClient }
  from './api-client';

export async function getProducts() {

  const response =
    await apiClient.get(
      '/products',
    );

  return response.data.data;
}