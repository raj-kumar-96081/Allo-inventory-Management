import { redis }
  from '@/infrastructure/redis/redis';

const TTL_SECONDS = 60 * 60;

export async function getIdempotency(
  key: string,
) {

  const value =
    await redis.get(
      `idempotency:${key}`,
    );

  if (!value) {
    return null;
  }

  return JSON.parse(value);
}

export async function setIdempotency(
  key: string,
  response: unknown,
) {

  await redis.set(
    `idempotency:${key}`,

    JSON.stringify(response),

    'EX',

    TTL_SECONDS,
  );
}