import { redis } from '@/infrastructure/redis/redis';
import { NextResponse } from 'next/server';

export async function GET() {
  await redis.set('health', 'ok');

  const value = await redis.get('health');

  return NextResponse.json({
    success: true,
    redis: value,
  });
}