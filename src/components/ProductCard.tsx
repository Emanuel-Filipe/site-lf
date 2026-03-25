import { motion } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import type { ProductAvailability } from "@/lib/products";

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  availability: ProductAvailability;
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
            <span className="rounded-full border border-[rgba(212,175,110,0.2)] bg-black/75 px-3 py-1 text-xs font-medium text-[#d4af6e] backdrop-blur-sm">
              {product.category}
            </span>

            <span
              className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]"
              style={{
                background:
                  product.availability === "disponivel"
                    ? "rgba(37,211,102,0.16)"
                    : "rgba(212,175,110,0.16)",
                color: product.availability === "disponivel" ? "#8ff0b4" : "#f0cf93",
                border:
                  product.availability === "disponivel"
                    ? "1px solid rgba(37,211,102,0.35)"
                    : "1px solid rgba(212,175,110,0.35)",
              }}
            >
              {product.availability === "disponivel" ? "Disponível" : "Encomenda"}
            </span>
          </div>
        </button>

        <div className="space-y-3 p-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
            <p className="text-xs text-muted-foreground">
              {product.sizes.length > 0
                ? `Tamanhos: ${product.sizes.join(", ")}`
                : "Consulte tamanhos disponíveis"}
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

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleOpenProduct}
              className="flex-1 rounded-xl border border-[#2a2a2a] px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#f0f0f0] transition-colors hover:border-[#c9956a] hover:text-[#d4af6e]"
            >
              Ver produto
            </button>

            <motion.button
              type="button"
              onClick={handleAddToCart}
              className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-black sm:text-xs sm:tracking-[0.16em]"
              style={{
                background: added ? "#25d366" : "linear-gradient(135deg, #c9956a, #d4af6e)",
              }}
              whileTap={{ scale: 0.96 }}
              animate={added ? { scale: [1, 1.05, 1] } : {}}
              initial={false}
            >
              {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
              <span>{product.availability === "disponivel" ? "Adicionar" : "Encomendar"}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
