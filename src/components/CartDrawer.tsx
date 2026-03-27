import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/contexts/CartContext";
import { getStoreSettings } from "@/lib/storeSettings";

const CartDrawer = () => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    totalItems,
    totalPrice,
    checkoutWhatsApp,
  } = useCart();

  const { data: settings } = useQuery({
    queryKey: ["store-settings"],
    queryFn: getStoreSettings,
  });

  const whatsappNumber = settings?.whatsappNumber || "5517991755566";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 z-40 flex h-full w-full max-w-sm flex-col border-l border-[#252525] bg-[#141414]"
          >
            <div className="flex items-center justify-between border-b border-[#252525] px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#d4af6e]" />
                <span className="font-display text-xl tracking-widest text-foreground">CARRINHO</span>
                {totalItems > 0 && (
                  <span className="rounded-full bg-gradient-gold px-2 py-0.5 text-xs font-semibold text-black">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="rounded-lg p-2 text-[#666] transition-colors hover:bg-white/5"
                aria-label="Fechar carrinho"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex h-full flex-col items-center justify-center gap-4 py-20"
                  >
                    <ShoppingBag className="h-12 w-12 text-[#333]" />
                    <p className="text-sm text-[#555]">Seu carrinho está vazio</p>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size || "sem-tamanho"}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-3 border-b border-[#1e1e1e] px-5 py-4"
                    >
                      <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-[#1e1e1e]">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/${item.slug}`}
                          onClick={closeCart}
                          className="truncate text-sm font-medium text-foreground transition-colors hover:text-[#d4af6e]"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-[#666]">{item.category}</p>
                        {item.size && <p className="mt-1 text-xs text-[#999]">Tamanho: {item.size}</p>}
                        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d4af6e]">
                          {item.availability === "disponivel" ? "Disponível" : "Encomenda"}
                        </p>
                        <p className="mt-1 text-sm font-bold text-gradient-gold">
                          R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                        </p>

                        <div className="mt-2 flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                            className="flex h-6 w-6 items-center justify-center rounded border border-[#333] text-[#888] transition-colors hover:bg-white/10"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                            className="flex h-6 w-6 items-center justify-center rounded border border-[#333] text-[#888] transition-colors hover:bg-white/10"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="self-start p-1 text-[#444] transition-colors hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {items.length > 0 && (
              <div className="space-y-4 border-t border-[#252525] bg-[#111] px-5 py-5">
                <div className="rounded-2xl border border-[#d4af6e]/15 bg-black/20 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#888]">Total</span>
                    <span className="text-lg font-bold text-foreground">
                      R$ {totalPrice.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#666]">
                    O pedido será enviado pronto para o WhatsApp com os itens e tamanhos.
                  </p>
                </div>

                <button
                  onClick={() => checkoutWhatsApp(whatsappNumber)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25d366] py-3.5 text-sm font-semibold tracking-wider text-white transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  <MessageCircle className="h-5 w-5" />
                  FINALIZAR PELO WHATSAPP
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
