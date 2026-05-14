'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cart.store';
import { useReservationStore } from '@/stores/reservation.store';
import { createReservation } from '@/services/reservation.service';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface Inventory {
    warehouseId: string;
    warehouseName: string;
    availableQty: number;
    reservedQty: number;
    sellableQty: number;
}

interface Product {
    id: string;
    sku: string;
    name: string;
    description?: string;
    inventory: Inventory[];
}

export default function CartPage() {
    const router = useRouter();
    const { items, removeItem, increaseQuantity, decreaseQuantity } = useCartStore();
    const inventory = items[0];

    const setReservation = useReservationStore((state) => state.setReservation);
    const [loadingWarehouseId, setLoadingWarehouseId] = useState<string | null>(null);

    async function handleReserve(warehouseId: string) {
        try {
            setLoadingWarehouseId(warehouseId);
            const reservation = await createReservation({
                productId: inventory.productId,
                warehouseId,
                quantity: inventory.quantity,
            });

            setReservation(reservation.id, reservation.expiresAt);
            toast.success('Reservation created');
            router.push('/checkout');
        } catch (error: unknown) {
            console.log(error);
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Reservation failed');
            }
        } finally {
            setLoadingWarehouseId(null);
        }
    }

    return (
        <>
            <div className="min-h-full flex flex-col">
                <div className="container py-5">
                    <div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => router.push('/')}
                        >
                            Continue Shopping
                        </button>
                    </div>
                    
                    <h1 className="mb-4">Shopping Cart</h1>

                    {items.length === 0 && (
                        <div className="alert alert-warning">
                            Cart is empty
                        </div>
                    )}

                    {items.map((item) => (
                        <div
                            key={`${item.productId}-${item.warehouseId}`}
                            className="card mb-3"
                        >
                            <div className="card-body">
                                <h5>{item.name}</h5>
                                <p>SKU: {' '}{item.sku}</p>

                                <div className="d-flex align-items-center gap-2">
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => decreaseQuantity(item.productId, item.warehouseId)}
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => increaseQuantity(item.productId, item.warehouseId)}
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    className="btn btn-danger mt-3"
                                    onClick={() => removeItem(item.productId, item.warehouseId)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    {items.length > 0 && (
                        <button
                            className="btn btn-success flex-fill"
                            disabled={
                                !inventory ||
                                inventory.sellableQty <= 0 ||
                                loadingWarehouseId === inventory.warehouseId
                            }
                            onClick={() => {
                                if (inventory) {
                                    handleReserve(inventory.warehouseId);
                                }
                            }}
                        >
                            {loadingWarehouseId === inventory.warehouseId
                                ? 'Purchasing...'
                                : 'Proceed to Checkout'}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}