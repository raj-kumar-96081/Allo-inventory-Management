'use client';

import {
  ProductCard,
} from '@/components/product/product-card';

import {
  useProducts,
} from '@/hooks/use-products';

import {
  ProductSkeleton,
} from '@/components/ui/product-skeleton';
import { useRouter }
    from 'next/navigation';

export default function HomePage() {

  const router = useRouter();

  const {
    data,
    isLoading,
  } = useProducts();


  if (isLoading) {

    return (
      <div className="container py-5">

        <div className="row">

          {
            Array.from({
              length: 6,
            }).map((_, index) => (

              <div
                key={index}
                className="
                col-md-4
                mb-4
              "
              >

                <ProductSkeleton />

              </div>
            ))
          }

        </div>

      </div>
    );
  }

  return (
    <div className="container py-5">

      <div>
        <button
          className="btn btn-secondary"
          onClick={() => router.push('/cart')}
        >
          Go to Cart
        </button>
      </div>

      <h1 className="mb-4">
        Products
      </h1>

      <div className="row">

        {
          data?.map(
            (product: any) => (

              <div
                key={product.id}
                className="
                  col-md-4
                  mb-4
                "
              >

                <ProductCard
                  product={product}
                />

              </div>
            ),
          )
        }

      </div>
    </div>
  );
}