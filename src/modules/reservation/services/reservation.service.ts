import { prisma }
    from '@/infrastructure/prisma/prisma';

import {
    ConflictError,
    NotFoundError,
    ValidationError,
} from '@/shared/errors';

import { ReservationStatus }
    from '@/domain/entities/reservation.entity';

import { CreateReservationDto }
    from '@/application/dto/reservation/create-reservation.dto';

import { ReservationResponseDto }
    from '@/application/dto/reservation/reservation-response.dto';

import { RESERVATION_DURATION_MINUTES }
    from '@/shared/constants/reservation.constants';

import { InventoryModel } from '@/generated/prisma/models/Inventory';


export class ReservationService {

    async createReservation(
        dto: CreateReservationDto,
    ): Promise<ReservationResponseDto> {

        return prisma.$transaction(
            async (tx) => {

                const inventoryRows =
                    await tx.$queryRawUnsafe<InventoryModel[]>(`
            SELECT *
            FROM "Inventory"
            WHERE "productId" = '${dto.productId}'
            AND "warehouseId" = '${dto.warehouseId}'
            FOR UPDATE
          `);

                if (!inventoryRows.length) {
                    throw new NotFoundError(
                        'Inventory not found',
                    );
                }

                const inventory = inventoryRows[0];

                const sellableQty =
                    inventory.availableQty -
                    inventory.reservedQty;

                if (sellableQty < dto.quantity) {
                    throw new ConflictError(
                        'Insufficient inventory',
                    );
                }

                await tx.inventory.update({
                    where: {
                        id: inventory.id,
                    },
                    data: {
                        reservedQty: {
                            increment: dto.quantity,
                        },

                        version: {
                            increment: 1,
                        },
                    },
                });

                const expiresAt = new Date(
                    Date.now() +
                    RESERVATION_DURATION_MINUTES *
                    60 *
                    1000,
                );

                const reservation =
                    await tx.reservation.create({
                        data: {
                            productId: dto.productId,
                            warehouseId: dto.warehouseId,
                            quantity: dto.quantity,
                            status: 'PENDING',
                            expiresAt,
                        },
                    });

                await tx.inventoryLedger.create({
                    data: {
                        inventoryId: inventory.id,

                        eventType: 'RESERVED',

                        quantity: dto.quantity,

                        referenceId: reservation.id,

                        metadata: {
                            reservationId: reservation.id,
                        },
                    },
                });

                return {
                    id: reservation.id,
                    productId: reservation.productId,
                    warehouseId: reservation.warehouseId,
                    quantity: reservation.quantity,
                    status:
                        reservation.status as ReservationStatus,
                    expiresAt: reservation.expiresAt,
                    createdAt: reservation.createdAt,
                };
            },

            {
                isolationLevel: 'Serializable',
            },
        );
    };

    async confirmReservation(
        reservationId: string,
    ) {

        return prisma.$transaction(
            async (tx) => {

                const reservation =
                    await tx.reservation.findUnique({
                        where: {
                            id: reservationId,
                        },
                    });

                if (!reservation) {
                    throw new NotFoundError(
                        'Reservation not found',
                    );
                }

                if (
                    reservation.status !== 'PENDING'
                ) {
                    throw new ConflictError(
                        'Reservation not pending',
                    );
                }

                if (
                    new Date() >
                    reservation.expiresAt
                ) {

                    throw new ValidationError(
                        'Reservation expired',
                    );
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
                    throw new NotFoundError(
                        'Inventory not found',
                    );
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

                        availableQty: {
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
                        status: 'CONFIRMED',
                        confirmedAt: new Date(),
                    },
                });

                await tx.inventoryLedger.create({
                    data: {
                        inventoryId: inventory.id,

                        eventType: 'CONFIRMED',

                        quantity:
                            reservation.quantity,

                        referenceId:
                            reservation.id,
                    },
                });

                return {
                    success: true,
                };
            },
        );
    };

    async releaseReservation(
        reservationId: string,
    ) {

        return prisma.$transaction(
            async (tx) => {

                const reservation =
                    await tx.reservation.findUnique({
                        where: {
                            id: reservationId,
                        },
                    });

                if (!reservation) {
                    throw new NotFoundError(
                        'Reservation not found',
                    );
                }

                if (
                    reservation.status !== 'PENDING'
                ) {
                    throw new ConflictError(
                        'Reservation cannot be released',
                    );
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
                    throw new NotFoundError(
                        'Inventory not found',
                    );
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

                const updatedReservation =
                    await tx.reservation.update({
                        where: {
                            id: reservation.id,
                        },

                        data: {
                            status: 'RELEASED',
                            releasedAt: new Date(),
                        },
                    });

                await tx.inventoryLedger.create({
                    data: {
                        inventoryId: inventory.id,

                        eventType: 'RELEASED',

                        quantity:
                            reservation.quantity,

                        referenceId:
                            reservation.id,

                        metadata: {
                            reservationId:
                                reservation.id,
                        },
                    },
                });

                return {
                    success: true,
                    reservationId:
                        updatedReservation.id,
                    status:
                        updatedReservation.status,
                };
            },
        );
    };

    // async releaseReservation(
    //     reservationId: string,
    // ) {

    //     return prisma.$transaction(
    //         async (tx) => {

    //             const reservation =
    //                 await tx.reservation.findUnique({
    //                     where: {
    //                         id: reservationId,
    //                     },
    //                 });

    //             if (!reservation) {
    //                 throw new NotFoundError(
    //                     'Reservation not found',
    //                 );
    //             }

    //             if (
    //                 reservation.status !== 'PENDING'
    //             ) {
    //                 throw new ConflictError(
    //                     'Reservation cannot be released',
    //                 );
    //             }

    //             const inventory =
    //                 await tx.inventory.findFirst({
    //                     where: {
    //                         productId:
    //                             reservation.productId,

    //                         warehouseId:
    //                             reservation.warehouseId,
    //                     },
    //                 });

    //             if (!inventory) {
    //                 throw new NotFoundError(
    //                     'Inventory not found',
    //                 );
    //             }

    //             await tx.inventory.update({
    //                 where: {
    //                     id: inventory.id,
    //                 },

    //                 data: {
    //                     reservedQty: {
    //                         decrement:
    //                             reservation.quantity,
    //                     },

    //                     version: {
    //                         increment: 1,
    //                     },
    //                 },
    //             });

    //             await tx.reservation.update({
    //                 where: {
    //                     id: reservation.id,
    //                 },

    //                 data: {
    //                     status: 'RELEASED',
    //                     releasedAt: new Date(),
    //                 },
    //             });

    //             await tx.inventoryLedger.create({
    //                 data: {
    //                     inventoryId: inventory.id,

    //                     eventType: 'RELEASED',

    //                     quantity:
    //                         reservation.quantity,

    //                     referenceId:
    //                         reservation.id,
    //                 },
    //             });

    //             return {
    //                 success: true,
    //                 reservationId:
    //                     updatedReservation.id,
    //                 status:
    //                     updatedReservation.status,
    //             };
    //         },
    //     );
    // }

}