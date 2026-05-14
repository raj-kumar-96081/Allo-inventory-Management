import { Queue }
    from 'bullmq';

import { bullmqConnection }
    from '../redis/bullmq-connection';

export const reservationExpiryQueue =
    new Queue(
        'reservation-expiry',

        {
            connection:
                bullmqConnection,

        },
    );