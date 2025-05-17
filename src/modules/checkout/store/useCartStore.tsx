import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TenantCart {
  productIds: string[];
}

interface CartState {
  tenantCart: Record<string, TenantCart>;
  addProduct: (tenantSlug: string, productId: string) => void;
  removeProduct: (tenantSlug: string, productId: string) => void;
  clearCart: (tenantSlug: string) => void;
  clearAllCarts: () => void;
  // getCartByTenant: (tenantSlug: string) => string[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      tenantCart: {},

      addProduct: (tenantSlug, productId) =>
        set((state) => {
          const currentProducts = state.tenantCart[tenantSlug]?.productIds || [];
          return {
            tenantCart: {
              ...state.tenantCart,
              [tenantSlug]: {
                productIds: [...currentProducts, productId],
              },
            },
          };
        }),

      removeProduct: (tenantSlug, productId) =>
        set((state) => {
          const currentProducts = state.tenantCart[tenantSlug]?.productIds || [];
          return {
            tenantCart: {
              ...state.tenantCart,
              [tenantSlug]: {
                productIds: currentProducts.filter((id) => id !== productId),
              },
            },
          };
        }),

      clearCart: (tenantSlug) =>
        set((state) => {
          const updatedCart = { ...state.tenantCart };
          delete updatedCart[tenantSlug];
          return { tenantCart: updatedCart };
        }),

      clearAllCarts: () => set({ tenantCart: {} }),

      // getCartByTenant: (tenantSlug) => get().tenantCart[tenantSlug]?.productIds || [],
    }),
    {
      name: "tradeNext",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
