import { NextResponse } from 'next/server';

import { ProductService }
  from '@/application/services/product.service';

import { handleApiError }
  from '@/shared/utils/handle-api-error';

const productService =
  new ProductService();

export async function GET() {
  try {

    const products =
      await productService.getProducts();

    return NextResponse.json({
      success: true,
      data: products,
    });

  } catch (error) {

    return handleApiError(error);

  }
}