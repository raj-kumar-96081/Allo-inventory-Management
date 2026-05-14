import { Worker }
  from 'bullmq';

import { prisma }
  from '@/infrastructure/prisma/prisma';

import { bullmqConnection }
  from '@/infrastructure/redis/bullmq-connection';

const worker = new Worker(
  'reservation-expiry',

  async (job) => {

    const {
      reservationId,
    } = job.data;

    console.log(
      `Processing expiry for ${reservationId}`,
    );

    await prisma.$transaction(
      async (tx) => {

        const reservation =
          await tx.reservation.findUnique({
            where: {
              id: reservationId,
            },
          });

        if (!reservation) {
          return;
        }

        if (
          reservation.status !== 'PENDING'
        ) {
          return;
        }

        if (
          new Date() <
          reservation.expiresAt
        ) {
          return;
        }

        const inventory =
          await tx.inventory.findFirst({
            where: {
              productId:
                reservation.productId,

              warehouseId:
                reservation.warehouseId,
            },
          });

        if (!inventory) {
          return;
        }

        await tx.inventory.update({
          where: {
            id: inventory.id,
          },

          data: {
            reservedQty: {
              decrement:
                reservation.quantity,
            },

            version: {
              increment: 1,
            },
          },
        });

        await tx.reservation.update({
          where: {
            id: reservation.id,
          },

          data: {
            status: 'EXPIRED',
          },
        });

        await tx.inventoryLedger.create({
          data: {
            inventoryId:
              inventory.id,

            eventType: 'RELEASED',

            quantity:
              reservation.quantity,

            referenceId:
              reservation.id,

            metadata: {
              reason: 'AUTO_EXPIRY',
            },
          },
        });

        console.log(
          `Reservation expired: ${reservation.id}`,
        );
      },
    );
  },

  {
    connection:
      bullmqConnection,

    concurrency: 1,

    drainDelay: 3000,

    lockDuration: 300000,

    stalledInterval: 300000,
  },
);

worker.on(
  'completed',
  (job) => {
    console.log(
      `Job completed ${job.id}`,
    );
  },
);

worker.on(
  'failed',
  (job, error) => {
    console.error(
      `Job failed ${job?.id}`,
      error,
    );
  },
);