import { redis }
    from '@/infrastructure/redis/redis';

import {
    ConflictError,
} from '@/shared/errors';

const WINDOW_SECONDS = 60;

const MAX_REQUESTS = 30;

export async function rateLimit(
    identifier: string,
) {

    const key =
        `rate-limit:${identifier}`;

    const requests =
        await redis.incr(key);

    if (requests === 1) {
        await redis.expire(
            key,
            WINDOW_SECONDS,
        );
    }

    if (requests > MAX_REQUESTS) {
        throw new ConflictError(
            'Rate limit exceeded',
        );
    }
}