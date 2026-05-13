import IORedis from 'ioredis';

export const bullmqConnection =
  new IORedis(
    process.env.REDIS_URL!,
    {
      maxRetriesPerRequest: null,
    },
  );