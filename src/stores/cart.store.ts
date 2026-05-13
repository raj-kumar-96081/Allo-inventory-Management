import { create }
  from 'zustand';

interface CartItem {
  productId: string;

  warehouseId: string;

  name: string;

  sku: string;

  quantity: number;

  sellableQty: number;
}

interface CartState {
  items: CartItem[];

  addItem: (
    item: CartItem,
  ) => void;

  removeItem: (
    productId: string,
    warehouseId: string,
  ) => void;

  clearCart: () => void;

  increaseQuantity: (
    productId: string,
    warehouseId: string,
  ) => void;

  decreaseQuantity: (
    productId: string,
    warehouseId: string,
  ) => void;
}

export const useCartStore =
  create<CartState>(
    (set, get) => ({

      items: [],

      addItem: (item) => {

        const existingItem =
          get().items.find(
            (cartItem) =>
              cartItem.productId ===
                item.productId &&
              cartItem.warehouseId ===
                item.warehouseId,
          );

        if (existingItem) {

          set({
            items: get().items.map(
              (cartItem) => {

                if (
                  cartItem.productId ===
                    item.productId &&
                  cartItem.warehouseId ===
                    item.warehouseId
                ) {

                  return {
                    ...cartItem,

                    quantity:
                      cartItem.quantity + 1,
                  };
                }

                return cartItem;

              },
            ),
          });

          return;
        }

        set({
          items: [
            ...get().items,
            item,
          ],
        });
      },

      removeItem: (
        productId,
        warehouseId,
      ) => {

        set({
          items: get().items.filter(
            (item) =>
              !(
                item.productId ===
                  productId &&
                item.warehouseId ===
                  warehouseId
              ),
          ),
        });
      },

      increaseQuantity: (
        productId,
        warehouseId,
      ) => {

        set({
          items: get().items.map(
            (item) => {

              if (
                item.productId ===
                  productId &&
                item.warehouseId ===
                  warehouseId
              ) {

                return {
                  ...item,

                  quantity:
                    item.quantity + 1,
                };
              }

              return item;

            },
          ),
        });
      },

      decreaseQuantity: (
        productId,
        warehouseId,
      ) => {

        set({
          items: get().items.map(
            (item) => {

              if (
                item.productId ===
                  productId &&
                item.warehouseId ===
                  warehouseId
              ) {

                return {
                  ...item,

                  quantity:
                    Math.max(
                      1,
                      item.quantity - 1,
                    ),
                };
              }

              return item;

            },
          ),
        });
      },

      clearCart: () => {
        set({
          items: [],
        });
      },
    }),
  );