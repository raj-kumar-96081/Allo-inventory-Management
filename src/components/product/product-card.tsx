'use client';

import { useRouter }
    from 'next/navigation';

import { toast }
    from 'react-toastify';

import {
    useCartStore,
} from '@/stores/cart.store';

import {
    createReservation,
} from '@/services/reservation.service';

import {
    useReservationStore,
} from '@/stores/reservation.store';

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

export function ProductCard({
    product,
}: Props) {

    const router = useRouter();

    const addItem =
        useCartStore(
            (state) =>
                state.addItem,
        );

    function handleAddToCart(
        inventory: Inventory,
    ) {

        addItem({
            productId: product.id,

            warehouseId:
                inventory.warehouseId,

            name: product.name,

            sku: product.sku,

            quantity: 1,

            sellableQty:
                inventory.sellableQty,
        });

        toast.success(
            'Added to cart',
        );
    }

    function handleBuyNow(
        inventory: Inventory,
    ) {

        addItem({
            productId: product.id,

            warehouseId:
                inventory.warehouseId,

            name: product.name,

            sku: product.sku,

            quantity: 1,

            sellableQty:
                inventory.sellableQty,
        });

        router.push('/checkout');
    }

    const setReservation =
        useReservationStore(
            (state) =>
                state.setReservation,
        );

    const [loadingWarehouseId,
        setLoadingWarehouseId] =
        useState<string | null>(
            null,
        );

    async function handleReserve(
        warehouseId: string,
    ) {

        try {

            setLoadingWarehouseId(
                warehouseId,
            );

            const reservation =
                await createReservation({
                    productId: product.id,
                    warehouseId,
                    quantity: 1,
                    
                });

            setReservation(
                reservation.id,
                reservation.expiresAt,
            );

            toast.success(
                'Purchase created',
            );

            router.push('/checkout');

        } catch (error: unknown) {

            toast.error(
                error.response?.data?.error?.message ??
                'Reservation failed',
            );

        } finally {

            setLoadingWarehouseId(
                null,
            );

        }
    }

    return (
        <>
            <div>
                <button
                    className="btn btn-secondary"
                    onClick={() => router.push('/cart')}
                >
                    Go to Cart
                </button>
            </div>
            <div
                className="
        card
        shadow-sm
        h-100
      "
            >

                <img
                    src="https://placehold.co/600x400"

                    className="card-img-top"

                    alt={product.name}
                />

                <div className="card-body">

                    <h5 className="card-title">
                        {product.name}
                    </h5>

                    <p className="text-muted">
                        SKU:
                        {' '}
                        {product.sku}
                    </p>

                    {
                        product.description && (
                            <p>
                                {
                                    product.description
                                }
                            </p>
                        )
                    }

                    <hr />

                    {
                        product.inventory.map(
                            (inventory) => (

                                <div
                                    key={
                                        inventory.warehouseId
                                    }

                                    className="
                  border
                  rounded
                  p-3
                  mb-3
                "
                                >

                                    <div className="mb-2">

                                        <strong>
                                            {
                                                inventory.warehouseName
                                            }
                                        </strong>

                                    </div>

                                    <div className="mb-2">

                                        Available:
                                        {' '}
                                        {
                                            inventory.sellableQty
                                        }

                                    </div>

                                    <div
                                        className="
                    d-flex
                    gap-2
                  "
                                    >

                                        <button
                                            className="
                      btn
                      btn-warning
                      flex-fill
                    "

                                            disabled={
                                                inventory.sellableQty <= 0
                                            }

                                            onClick={() =>
                                                handleAddToCart(
                                                    inventory,
                                                )
                                            }
                                        >
                                            Add to Cart
                                        </button>

                                        {/* <button
                                            className="btn btn-primary flex-fill"

                                            disabled={
                                                inventory.sellableQty <= 0
                                            }

                                            onClick={() =>
                                                handleBuyNow(
                                                    inventory,
                                                )
                                            }
                                        >
                                            Buy Now
                                        </button> */}

                                        <button
                                            className="btn btn-primary flex-fill"

                                            disabled={
                                                inventory.sellableQty <= 0 ||
                                                loadingWarehouseId ===
                                                inventory.warehouseId
                                            }

                                            onClick={() =>
                                                handleReserve(
                                                    inventory.warehouseId,
                                                )
                                            }
                                        >
                                            {
                                                loadingWarehouseId ===
                                                    inventory.warehouseId
                                                    ? 'Purchasing...'
                                                    : 'Buy Now'
                                            }
                                        </button>

                                    </div>

                                </div>
                            ),
                        )
                    }

                </div>

            </div>
        </>
    );
}

// 'use client';

// import { useState } from 'react';

// import { useRouter }
//   from 'next/navigation';

// import { toast }
//   from 'react-toastify';

// import {
//   createReservation,
// } from '@/services/reservation.service';

// import {
//   useReservationStore,
// } from '@/stores/reservation.store';

// interface Inventory {
//   warehouseId: string;

//   warehouseName: string;

//   availableQty: number;

//   reservedQty: number;

//   sellableQty: number;
// }

// interface Product {
//   id: string;

//   sku: string;

//   name: string;

//   description?: string;

//   inventory: Inventory[];
// }

// interface Props {
//   product: Product;
// }

// export function ProductCard({
//   product,
// }: Props) {

//   const router = useRouter();

//   const setReservation =
//     useReservationStore(
//       (state) =>
//         state.setReservation,
//     );

//   const [loadingWarehouseId,
//     setLoadingWarehouseId] =
//     useState<string | null>(
//       null,
//     );

//   async function handleReserve(
//     warehouseId: string,
//   ) {

//     try {

//       setLoadingWarehouseId(
//         warehouseId,
//       );

//       const reservation =
//         await createReservation({
//           productId: product.id,
//           warehouseId,
//           quantity: 1,
//         });

//       setReservation(
//         reservation.id,
//         reservation.expiresAt,
//       );

//       toast.success(
//         'Reservation created',
//       );

//       router.push('/checkout');

//     } catch (error: any) {

//       toast.error(
//         error.response?.data?.error?.message ??
//         'Reservation failed',
//       );

//     } finally {

//       setLoadingWarehouseId(
//         null,
//       );

//     }
//   }

//   return (
//     <div
//       className="
//         card
//         shadow-sm
//         h-100
//       "
//     >

//       <div className="card-body">

//         <div
//           className="
//             d-flex
//             justify-content-between
//             align-items-start
//             mb-3
//           "
//         >

//           <div>

//             <h5 className="card-title">
//               {product.name}
//             </h5>

//             <p
//               className="
//                 text-muted
//                 mb-1
//               "
//             >
//               SKU:
//               {' '}
//               {product.sku}
//             </p>

//           </div>

//         </div>

//         {
//           product.description && (
//             <p
//               className="
//                 text-secondary
//               "
//             >
//               {
//                 product.description
//               }
//             </p>
//           )
//         }

//         <hr />

//         <h6 className="mb-3">
//           Warehouse Inventory
//         </h6>

//         {
//           product.inventory.map(
//             (inventory) => (

//               <div
//                 key={
//                   inventory.warehouseId
//                 }

//                 className="
//                   border
//                   rounded
//                   p-3
//                   mb-3
//                 "
//               >

//                 <div
//                   className="
//                     d-flex
//                     justify-content-between
//                     align-items-center
//                     mb-2
//                   "
//                 >

//                   <strong>
//                     {
//                       inventory.warehouseName
//                     }
//                   </strong>

//                   <span
//                     className={`
//                       badge
//                       ${
//                         inventory.sellableQty > 0
//                           ? 'bg-success'
//                           : 'bg-danger'
//                       }
//                     `}
//                   >
//                     {
//                       inventory.sellableQty > 0
//                         ? 'In Stock'
//                         : 'Out of Stock'
//                     }
//                   </span>

//                 </div>

//                 <div className="mb-2">

//                   <div>
//                     Available:
//                     {' '}
//                     {
//                       inventory.availableQty
//                     }
//                   </div>

//                   <div>
//                     Reserved:
//                     {' '}
//                     {
//                       inventory.reservedQty
//                     }
//                   </div>

//                   <div>
//                     Sellable:
//                     {' '}
//                     <strong>
//                       {
//                         inventory.sellableQty
//                       }
//                     </strong>
//                   </div>

//                 </div>

//                 <button
//                   className="
//                     btn
//                     btn-primary
//                     w-100
//                   "

//                   disabled={
//                     inventory.sellableQty <= 0 ||
//                     loadingWarehouseId ===
//                       inventory.warehouseId
//                   }

//                   onClick={() =>
//                     handleReserve(
//                       inventory.warehouseId,
//                     )
//                   }
//                 >
//                   {
//                     loadingWarehouseId ===
//                     inventory.warehouseId
//                       ? 'Reserving...'
//                       : 'Reserve'
//                   }
//                 </button>

//               </div>
//             ),
//           )
//         }

//       </div>

//     </div>
//   );
// }

// 'use client';

// import { toast }
//     from 'react-toastify';

// import {
//     createReservation,
// } from '@/services/reservation.service';

// import {
//     useReservationStore,
// } from '@/stores/reservation.store';

// import { useRouter }
//     from 'next/navigation';
// import { useState } from 'react';

// interface Props {
//     product: any;
// }


// export function ProductCard({
//     product,
// }: Props) {

//     const router = useRouter();
//     const [loading, setLoading] = useState(false);

//     const setReservation =
//         useReservationStore(
//             (state) =>
//                 state.setReservation,
//         );

//     async function handleReserve(
//         warehouseId: string,
//     ) {

//         try {
//             setLoading(true);
//             const reservation =
//                 await createReservation({
//                     productId: product.id,
//                     warehouseId,
//                     quantity: 1,
//                 });

//             setReservation(
//                 reservation.id,
//                 reservation.expiresAt,
//             );

//             toast.success(
//                 'Reservation created',
//             );

//             router.push('/checkout');

//         } catch (error: any) {

//             toast.error(
//                 error.response?.data?.error?.message ??
//                 'Reservation failed',
//             );
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <div className="card shadow-sm">

//             <div className="card-body">

//                 <h5>
//                     {product.name}
//                 </h5>

//                 <p>
//                     SKU: {product.sku}
//                 </p>

//                 {
//                     product.inventory.map(
//                         (inventory: any) => (

//                             <div
//                                 key={
//                                     inventory.warehouseId
//                                 }

//                                 className="
//                   border
//                   rounded
//                   p-2
//                   mb-2
//                 "
//                             >

//                                 <div>
//                                     Warehouse:
//                                     {' '}
//                                     {
//                                         inventory.warehouseName
//                                     }
//                                 </div>

//                                 <div>
//                                     Available:
//                                     {' '}
//                                     {
//                                         inventory.sellableQty
//                                     }
//                                 </div>

//                                 <button
//                                     className="
//                     btn
//                     btn-primary
//                     mt-2
//                   "

//                                     onClick={() =>
//                                         handleReserve(
//                                             inventory.warehouseId,
//                                         )
//                                     }
//                                 >
//                                     Reserve
//                                 </button>

//                             </div>
//                         ),
//                     )
//                 }

//             </div>
//         </div>
//     );
// }