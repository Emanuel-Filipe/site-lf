import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { getProducts, type ProductAvailability } from "@/lib/products";

const CATEGORIES = ["Todos", "Conjuntos", "Leggings", "Tops", "Shorts"];
const AVAILABILITY_FILTERS: { label: string; value: "todos" | ProductAvailability }[] = [
  { label: "Todos", value: "todos" },
  { label: "Disponíveis", value: "disponivel" },
  { label: "Encomenda", value: "encomenda" },
];

const ProductGrid = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [availabilityFilter, setAvailabilityFilter] = useState<"todos" | ProductAvailability>("todos");

  const { data = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const products = useMemo(
    () =>
      data
        .filter((product) => product.active)
        .map((product) => ({
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: Number(product.price),
          images:
            product.images.length > 0
              ? product.images
              : [product.image_url || "/placeholder.svg"],
          category: product.category,
          availability: product.availability,
          sizes: product.sizes,
        })),
    [data]
  );

  const featuredStats = useMemo(
    () => ({
      disponiveis: products.filter((product) => product.availability === "disponivel").length,
      encomenda: products.filter((product) => product.availability === "encomenda").length,
    }),
    [products]
  );

  const filtered = products.filter((product) => {
    const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
    const matchesAvailability =
      availabilityFilter === "todos" || product.availability === availabilityFilter;

    return matchesCategory && matchesAvailability;
  });

  return (
    <section id="produtos" className="py-20" style={{ background: "#0d0d0d" }}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <div className="mb-4 flex justify-center gap-3">
            <span className="rounded-full border border-[#d4af6e]/25 bg-[#171717] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#f0cf93]">
              {featuredStats.disponiveis} disponíveis agora
            </span>
            <span className="rounded-full border border-white/10 bg-[#171717] px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/70">
              {featuredStats.encomenda} sob encomenda
            </span>
          </div>
          <h2 className="mb-2 font-display text-5xl tracking-wider text-foreground md:text-6xl">
            NOSSOS PRODUTOS
          </h2>
          <p className="mx-auto max-w-2xl text-base" style={{ color: "#666" }}>
            Navegue por categorias, abra a página de cada produto e compre com mais segurança,
            vendo detalhes, tamanhos e disponibilidade.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 flex flex-wrap items-center justify-center gap-2"
        >
          {AVAILABILITY_FILTERS.map((filter) => {
            const isActive = availabilityFilter === filter.value;

            return (
              <button
                key={filter.value}
                onClick={() => setAvailabilityFilter(filter.value)}
                className="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200"
                style={{
                  background: isActive ? "linear-gradient(135deg, #c9956a, #d4af6e)" : "transparent",
                  color: isActive ? "#000" : "#666",
                  border: `1px solid ${isActive ? "transparent" : "#2a2a2a"}`,
                }}
              >
                {filter.label}
              </button>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 flex flex-wrap items-center justify-center gap-2"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200"
                style={{
                  background: isActive ? "linear-gradient(135deg, #c9956a, #d4af6e)" : "transparent",
                  color: isActive ? "#000" : "#666",
                  border: `1px solid ${isActive ? "transparent" : "#2a2a2a"}`,
                }}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${availabilityFilter}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
          >
            {filtered.length > 0 ? (
              filtered.map((product) => <ProductCard key={product.id} product={product} />)
            ) : (
              <div className="col-span-full py-16 text-center" style={{ color: "#555" }}>
                Nenhum produto nessa combinação ainda.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProductGrid;
