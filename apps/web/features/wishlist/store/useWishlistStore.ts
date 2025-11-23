import { create } from "zustand";
import type { WishlistState } from "@/features/wishlist/type/wishlist.type";

export const useWishlistStore = create<WishlistState>((set, _get) => ({
  items: [],
  loading: true,

  addToWishlist: (newItem) =>
    set((state) => {
      return {
        items: [...state.items, newItem],
      };
    }),

  removeFromWishlist: (wishlist_item_id) =>
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.wishlist_item_id === wishlist_item_id)
      ),
    })),
  setLoading: (v) =>
    set(() => ({
      loading: v,
    })),

  clearWishlist: () => set({ items: [] }),
}));
