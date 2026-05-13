import { NextResponse } from 'next/server';

import { WarehouseService }
  from '@/application/services/warehouse.service';

import { handleApiError }
  from '@/shared/utils/handle-api-error';

const warehouseService =
  new WarehouseService();

export async function GET() {
  try {

    const warehouses =
      await warehouseService.getWarehouses();

    return NextResponse.json({
      success: true,
      data: warehouses,
    });

  } catch (error) {

    return handleApiError(error);

  }
}