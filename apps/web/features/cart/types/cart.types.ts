// features/cart/types/cart.types.ts

export interface CartItem {
  id: string;
  variant_id: string;
  cart_item_id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  storage?: string;
  color?: string;
  size?: string;
}

export interface CartState {
  items: CartItem[];
  loading: boolean;

  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, variant_id: string) => void;
  updateQuantity: (id: number, variant_id: string, quantity: number) => void;
  setLoading: (v: boolean) => void;

  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}
