'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useCartStore } from '@/stores/cart.store';
import { createReservation } from '@/services/reservation.service';
import { useReservationStore } from '@/stores/reservation.store';
import { useState } from 'react';

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

interface Props {
    product: Product;
}

export function ProductCard({ product }: Props) {
    const router = useRouter();
    const addItem = useCartStore((state) => state.addItem);
    const setReservation = useReservationStore((state) => state.setReservation);
    const [loadingWarehouseId, setLoadingWarehouseId] = useState<string | null>(null);

    function handleAddToCart(inventory: Inventory) {
        addItem({
            productId: product.id,
            warehouseId: inventory.warehouseId,
            name: product.name,
            sku: product.sku,
            quantity: 1,
            sellableQty: inventory.sellableQty,
        });
        toast.success('Added to cart');
    }

    async function handleReserve(warehouseId: string) {
        try {
            setLoadingWarehouseId(warehouseId);
            const reservation = await createReservation({
                productId: product.id,
                warehouseId,
                quantity: 1,
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
        <div className="card shadow-sm h-100 rounded-4 overflow-hidden product-card">
            <img src="mix.avif" className="card-img-top" alt={product.name} />

            <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="text-muted">SKU: {' '}{product.sku}</p>

                {product.description && <p>{product.description}</p>}
                <hr />

                {product.inventory.map((inventory) => (
                    <div key={inventory.warehouseId} className="border rounded p-3 mb-3">
                        <span className={`badge ${inventory.sellableQty > 0 ? 'bg-success' : 'bg-danger'}`}>
                            {inventory.sellableQty > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>

                        <div className="mb-2">
                            <strong>{inventory.warehouseName}</strong>
                        </div>

                        <div>Reserved: {' '}{inventory.reservedQty}</div>
                        <div>Sellable: {' '}<strong>{inventory.sellableQty}</strong></div>
                        <div className="mb-2">Available: {' '}{inventory.availableQty}</div>

                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-warning flex-fill"
                                disabled={inventory.sellableQty <= 0}
                                onClick={() => handleAddToCart(inventory)}
                            >
                                Add to Cart
                            </button>

                            <button
                                className="btn btn-primary flex-fill"
                                disabled={inventory.sellableQty <= 0 || loadingWarehouseId === inventory.warehouseId}
                                onClick={() => handleReserve(inventory.warehouseId)}
                            >
                                {loadingWarehouseId === inventory.warehouseId ? 'Purchasing...' : 'Buy Now'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
