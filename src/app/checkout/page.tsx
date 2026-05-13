'use client';

import { useRouter }
    from 'next/navigation';

import { useState }
    from 'react';

import { toast }
    from 'react-toastify';

import {
    ReservationTimer,
} from '@/components/reservation/reservation-timer';

import {
    confirmReservation,
    releaseReservation,
} from '@/services/reservation.service';

import {
    useReservationStore,
} from '@/stores/reservation.store';


// import{

// }

export default function CheckoutPage() {

    const router = useRouter();

    const {
        reservationId,
        expiresAt,
        clearReservation,
    } = useReservationStore();

    const [loading,
        setLoading] =
        useState(false);

    if (
        !reservationId ||
        !expiresAt
    ) {

        return (
            <div className="container py-5">

                <div
                    className="
            alert
            alert-warning
          "
                >
                    No active reservation
                </div>

            </div>
        );
    }

    async function handleConfirm() {

        if (!reservationId) {
            return;
        }

        try {

            setLoading(true);

            await confirmReservation(
                reservationId,
            );

            toast.success(
                'Purchase confirmed',
            );

            clearReservation();

            router.push('/');

        } catch (error: any) {

            toast.error(
                error.response?.data?.error?.message ??
                'Confirmation failed',
            );

        } finally {

            setLoading(false);

        }
    }

    async function handleRelease() {

        if (!reservationId) {
            return;
        }

        try {

            setLoading(true);

            await releaseReservation(
                reservationId,
            );

            toast.success(
                'Reservation released',
            );

            clearReservation();

            router.push('/');

        } catch (error: any) {

            toast.error(
                error.response?.data?.error?.message ??
                'Release failed',
            );

        } finally {

            setLoading(false);

        }
    }

    return (
        <div className="container py-5">

            <div className="row justify-content-center">

                <div className="col-md-6">

                    <div className="card shadow">

                        <div className="card-body">

                            <h2 className="mb-4">
                                Checkout
                            </h2>

                            <ReservationTimer
                                expiresAt={expiresAt}
                            />

                            <div className="mb-3">

                                <strong>
                                    Reservation ID:
                                </strong>

                                <br />

                                {reservationId}

                            </div>

                            <div className="d-flex gap-3">

                                <button
                                    className="
                    btn
                    btn-success
                  "

                                    disabled={loading}

                                    onClick={
                                        handleConfirm
                                    }
                                >
                                    {
                                        loading
                                            ? 'Processing...'
                                            : 'Confirm Purchase'
                                    }
                                </button>

                                <button
                                    className="
                    btn
                    btn-outline-danger
                  "

                                    disabled={loading}

                                    onClick={
                                        handleRelease
                                    }
                                >
                                    Cancel Purchase
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}