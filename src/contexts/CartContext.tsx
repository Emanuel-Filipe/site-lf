import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { ProductAvailability } from "@/lib/products";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
  availability: ProductAvailability;
  size?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  checkoutWhatsApp: (phoneNumber: string) => void;
}

const CartContext = createContext<CartContextType | null>(null);

const getCartLineId = (id: string, size?: string) => `${id}::${size || "sem-tamanho"}`;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => getCartLineId(item.id, item.size) === getCartLineId(product.id, product.size)
      );
      if (existing) {
        return prev.map((item) =>
          getCartLineId(item.id, item.size) === getCartLineId(product.id, product.size)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });

    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string, size?: string) => {
    setItems((prev) => prev.filter((item) => getCartLineId(item.id, item.size) !== getCartLineId(id, size)));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => getCartLineId(item.id, item.size) !== getCartLineId(id, size)));
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        getCartLineId(item.id, item.size) === getCartLineId(id, size)
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checkoutWhatsApp = useCallback(
    (phoneNumber: string) => {
      if (items.length === 0) return;

      const itemsList = items
        .map((item) => {
          const lineTotal = (item.price * item.quantity).toFixed(2).replace(".", ",");
          const availabilityLabel =
            item.availability === "disponivel" ? "Disponivel" : "Encomenda";
          const sizeLabel = item.size ? ` | Tam. ${item.size}` : "";

          return `- ${item.name}${sizeLabel} | ${availabilityLabel}${item.quantity > 1 ? ` | x${item.quantity}` : ""} | R$ ${lineTotal}`;
        })
        .join("\n");

      const total = totalPrice.toFixed(2).replace(".", ",");
      const message = [
        "Olá! Gostaria de fazer um pedido da Lais Fitness.",
        "",
        "Meu pedido:",
        itemsList,
        "",
        `Total: R$ ${total}`,
        "",
        "Pode me passar as formas de pagamento e o prazo?",
      ].join("\n");

      const cleaned = phoneNumber.replace(/\D/g, "");
      window.open(`https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`, "_blank");
    },
    [items, totalPrice]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        toggleCart: () => setIsOpen((current) => !current),
        checkoutWhatsApp,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
