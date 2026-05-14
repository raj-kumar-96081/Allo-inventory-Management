'use client';

import { useEffect, useState } from 'react';
import { useReservationStore } from '@/stores/reservation.store';

interface Props {
    expiresAt: string;
}

export function ReservationTimer({ expiresAt }: Props) {
    const clearReservation = useReservationStore((state) => state.clearReservation);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const difference = new Date(expiresAt).getTime() - Date.now();

            if (difference <= 0) {
                setTimeLeft('Expired');
                clearReservation();
                return;
            }

            const minutes = Math.floor(difference / 60000);
            const seconds = Math.floor((difference % 60000) / 1000);

            setTimeLeft(
                `${minutes}:${seconds.toString().padStart(2, '0')}`
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt, clearReservation]);

    return (
        <div className="alert alert-warning">
            Reservation expires in: {' '}
            {timeLeft}
        </div>
    );
}