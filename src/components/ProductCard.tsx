import { motion } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import {
  getAvailabilityDescription,
  getDisplayAvailabilityLabel,
  getSizeAvailabilitySummary,
  type ProductAvailability,
  type ProductDisplayAvailability,
  type SizeAvailabilityMap,
} from "@/lib/products";

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  availability: ProductAvailability;
  displayAvailability: ProductDisplayAvailability;
  sizeAvailability: SizeAvailabilityMap;
  sizes: string[];
}

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered || product.images.length <= 1) {
      setActiveImageIndex(0);
      return;
    }

    const interval = window.setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % product.images.length);
    }, 2000);

    return () => window.clearInterval(interval);
  }, [isHovered, product.images]);

  const handleOpenProduct = () => {
    navigate(`/${product.slug}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (product.sizes.length > 0) {
      handleOpenProduct();
      return;
    }

    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[activeImageIndex] || product.images[0],
      category: product.category,
      availability: product.availability,
    });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden rounded-2xl border border-[#252525] bg-[#141414] transition-all duration-300 hover:border-[#c9956a]/50 hover:shadow-[0_0_24px_rgba(212,175,110,0.08)]">
        <button
          type="button"
          onClick={handleOpenProduct}
          className="relative block aspect-[3/4] w-full overflow-hidden text-left"
        >
          {product.images.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt={product.name}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                index === activeImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            />
          ))}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-80" />

          <div className="absolute left-3 top-3 flex flex-col gap-2">
            <span className="self-start rounded-full border border-[rgba(212,175,110,0.2)] bg-black/75 px-3 py-1 text-xs font-medium text-[#d4af6e] backdrop-blur-sm">
              {product.category}
            </span>

            <div className="flex flex-wrap gap-2">
              {product.displayAvailability === "misto" ? (
                <>
                  <span className="rounded-full border border-[rgba(37,211,102,0.35)] bg-[rgba(37,211,102,0.16)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ff0b4]">
                    Disponível
                  </span>
                  <span className="rounded-full border border-[rgba(212,175,110,0.35)] bg-[rgba(212,175,110,0.16)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f0cf93]">
                    Encomenda
                  </span>
                </>
              ) : (
                <span
                  className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]"
                  style={{
                    background:
                      product.displayAvailability === "disponivel"
                        ? "rgba(37,211,102,0.16)"
                        : "rgba(212,175,110,0.16)",
                    color: product.displayAvailability === "disponivel" ? "#8ff0b4" : "#f0cf93",
                    border:
                      product.displayAvailability === "disponivel"
                        ? "1px solid rgba(37,211,102,0.35)"
                        : "1px solid rgba(212,175,110,0.35)",
                  }}
                >
                  {getDisplayAvailabilityLabel(product.displayAvailability)}
                </span>
              )}
            </div>
          </div>
        </button>

        <div className="space-y-3 p-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
            <p className="text-xs text-muted-foreground">
              {getSizeAvailabilitySummary({
                sizes: product.sizes,
                size_availability: product.sizeAvailability,
                availability: product.availability,
              })}
            </p>
            <p className="text-[11px] leading-5 text-muted-foreground">
              {getAvailabilityDescription(product.displayAvailability)}
            </p>
            <p
              className="text-base font-bold"
              style={{
                background: "linear-gradient(135deg, #c9956a, #d4af6e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              R$ {product.price.toFixed(2).replace(".", ",")}
            </p>
          </div>

          <motion.button
            type="button"
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90"
            style={{
              background: added ? "#25d366" : "linear-gradient(135deg, #c9956a, #d4af6e)",
            }}
            whileTap={{ scale: 0.97 }}
            animate={added ? { scale: [1, 1.05, 1] } : {}}
            initial={false}
          >
            {added ? <Check className="h-4 w-4 shrink-0" /> : <ShoppingBag className="h-4 w-4 shrink-0" />}
            <span className="truncate">
              {added
                ? "Adicionado!"
                : product.sizes.length > 0
                  ? "Escolher tamanho"
                  : product.displayAvailability === "encomenda"
                    ? "Fazer encomenda"
                    : "Adicionar ao carrinho"}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
