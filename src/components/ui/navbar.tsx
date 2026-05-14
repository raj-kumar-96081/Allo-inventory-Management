'use client';

import Link from 'next/link';
import { useCartStore } from '@/stores/cart.store';

export function Navbar() {
    const items = useCartStore((state) => state.items);

    const totalItems = items.reduce(
        (sum, item) => sum + item.quantity,
        0,
    );

    return (
        <nav className="navbar navbar-dark bg-dark flex-md-row align-items-center p-3">
            <div className="container">
                <Link href="/" className="navbar-brand">
                    Allo Inventory
                </Link>

                <div className="d-flex align-items-center gap-3">
                    <Link href="/" className="btn btn-secondary">
                        Home
                    </Link>

                    <Link href="/cart" className="btn btn-warning">
                        Cart {' '} ({totalItems})
                    </Link>
                </div>
            </div>
        </nav>
    );
}