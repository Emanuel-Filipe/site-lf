import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { getProducts, type ProductAvailability } from "@/lib/products";

const CATEGORIES = ["Todos", "Conjuntos", "Leggings", "Tops", "Shorts"];
const AVAILABILITY_FILTERS: { label: string; value: "todos" | ProductAvailability }[] = [
  { label: "Todos", value: "todos" },
  { label: "Disponíveis", value: "disponivel" },
  { label: "Encomenda", value: "encomenda" },
];

type ProductGridProps = {
  mode?: "preview" | "catalog";
};

const ProductGrid = ({ mode = "catalog" }: ProductGridProps) => {
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

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
        const matchesAvailability =
          availabilityFilter === "todos" || product.availability === availabilityFilter;

        return matchesCategory && matchesAvailability;
      }),
    [activeCategory, availabilityFilter, products]
  );

  const visibleProducts = mode === "preview" ? filtered.slice(0, 4) : filtered;

  return (
    <section id="produtos" className="py-20" style={{ background: "#0d0d0d" }}>
      <div className="container mx-auto px-4">
        {mode === "preview" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
          >
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-[#d4af6e]">
                Seleção em destaque
              </p>
              <h2 className="font-display text-4xl tracking-[0.08em] text-foreground sm:text-5xl">
                Conheça parte da coleção
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#8f8b84] sm:text-base">
                Uma vitrine com algumas peças em destaque. Para explorar tudo com filtros e mais calma,
                abra o catálogo completo.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-full border border-[#d4af6e]/20 bg-[#151515] px-4 py-2 text-sm text-[#f0cf93]">
                {featuredStats.disponiveis} disponíveis
              </div>
              <div className="rounded-full border border-white/10 bg-[#151515] px-4 py-2 text-sm text-white/70">
                {featuredStats.encomenda} sob encomenda
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-[#d4af6e]">
                  Catálogo completo
                </p>
                <h1 className="font-display text-4xl tracking-[0.08em] text-foreground sm:text-5xl">
                  Explore todas as peças
                </h1>
                <p className="mt-4 text-sm leading-7 text-[#8f8b84] sm:text-base">
                  Use os filtros laterais para encontrar mais rápido o tipo de peça e a disponibilidade que você procura.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-full border border-[#d4af6e]/20 bg-[#151515] px-4 py-2 text-sm text-[#f0cf93]">
                  {featuredStats.disponiveis} disponíveis
                </div>
                <div className="rounded-full border border-white/10 bg-[#151515] px-4 py-2 text-sm text-white/70">
                  {featuredStats.encomenda} sob encomenda
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {mode === "catalog" ? (
          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
            <aside className="rounded-[1.75rem] border border-[#222] bg-[#101010] p-5 lg:sticky lg:top-28">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f0cf93]">
                  Disponibilidade
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {AVAILABILITY_FILTERS.map((filter) => {
                    const isActive = availabilityFilter === filter.value;

                    return (
                      <button
                        key={filter.value}
                        onClick={() => setAvailabilityFilter(filter.value)}
                        className="rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-200"
                        style={{
                          background: isActive ? "linear-gradient(135deg, #c9956a, #d4af6e)" : "#141414",
                          color: isActive ? "#000" : "#c8c0b4",
                          border: `1px solid ${isActive ? "transparent" : "#2a2a2a"}`,
                        }}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 border-t border-[#1d1d1d] pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f0cf93]">
                  Categorias
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat;

                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className="rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-200"
                        style={{
                          background: isActive ? "linear-gradient(135deg, #c9956a, #d4af6e)" : "#141414",
                          color: isActive ? "#000" : "#c8c0b4",
                          border: `1px solid ${isActive ? "transparent" : "#2a2a2a"}`,
                        }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCategory}-${availabilityFilter}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {visibleProducts.length > 0 ? (
                    visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)
                  ) : (
                    <div className="col-span-full rounded-[1.75rem] border border-[#222] bg-[#111] py-16 text-center text-[#767676]">
                      Nenhum produto encontrado nessa combinação.
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${availabilityFilter}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
              >
                {visibleProducts.length > 0 ? (
                  visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)
                ) : (
                  <div className="col-span-full rounded-[1.75rem] border border-[#222] bg-[#111] py-16 text-center text-[#767676]">
                    Nenhum produto disponível no momento.
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex justify-center">
              <Link
                to="/produtos"
                className="rounded-full border border-[#d4af6e]/25 bg-[#171717] px-7 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#f0cf93] transition-all hover:border-[#d4af6e] hover:bg-[#1c1c1c]"
              >
                Ver catálogo completo
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
