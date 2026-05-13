import { NextResponse } from 'next/server';

import { BaseError } from '@/shared/errors';

export function handleApiError(error: unknown) {
  console.error(error);

  if (error instanceof BaseError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          code: error.errorCode,
        },
      },
      {
        status: error.statusCode,
      },
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
      },
    },
    {
      status: 500,
    },
  );
}