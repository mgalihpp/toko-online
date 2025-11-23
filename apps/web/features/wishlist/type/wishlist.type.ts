// features/wishlist/types/wishlist.types.ts

export interface WishlistItem {
  product_id: string;
  wishlist_item_id: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  inStock: boolean;
}

export interface WishlistState {
  items: WishlistItem[];
  loading: boolean;

  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (wishlist_item_id: number) => void;
  setLoading: (v: boolean) => void;

  clearWishlist: () => void;
}
