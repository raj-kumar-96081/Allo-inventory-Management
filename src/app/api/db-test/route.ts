import { prisma } from '@/infrastructure/prisma/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  await prisma.$queryRaw`SELECT 1`;

  return NextResponse.json({
    success: true,
    database: 'connected',
  });
}