import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, ChevronLeft, MessageCircle, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import {
  getDisplayAvailability,
  getDisplayAvailabilityLabel,
  getProductBySlug,
  getProducts,
  getSizeAvailabilityLabel,
  normalizeSizeAvailability,
} from "@/lib/products";
import { useCart } from "@/contexts/CartContext";
import NotFound from "@/pages/NotFound";

const WHATSAPP_NUMBER = "5511999999999";

const ProductDetails = () => {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setSelectedImage(0);
    setSelectedSize(undefined);
  }, [slug]);

  const relatedProducts = useMemo(
    () =>
      allProducts
        .filter((item) => item.active && item.slug !== slug && item.category === product?.category)
        .slice(0, 3),
    [allProducts, product?.category, slug]
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Carregando...
      </div>
    );
  }

  if (!product || !product.active) return <NotFound />;

  const images = product.images.length > 0 ? product.images : [product.image_url || "/placeholder.svg"];
  const hasSizes = product.sizes.length > 0;
  const sizeAvailabilityMap = normalizeSizeAvailability(
    product.sizes,
    product.size_availability,
    product.availability
  );
  const displayAvailability = getDisplayAvailability(
    product.availability,
    product.size_availability,
    product.sizes
  );
  const selectedSizeAvailability = selectedSize
    ? sizeAvailabilityMap[selectedSize] || product.availability
    : product.availability;

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) return;

    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: images[selectedImage],
      category: product.category,
      availability: selectedSizeAvailability,
      size: selectedSize,
    });
  };

  const handleBuyNow = () => {
    if (hasSizes && !selectedSize) return;

    handleAddToCart();

    const availabilityText = hasSizes && selectedSize
      ? ` (${getSizeAvailabilityLabel(selectedSizeAvailability)})`
      : "";

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Olá! Tenho interesse no produto ${product.name}${selectedSize ? `, tamanho ${selectedSize}` : ""}${availabilityText}. Pode me ajudar?`
      )}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pb-16 pt-24 sm:pb-20 sm:pt-28 md:pt-32">
        <div className="mb-6 hidden flex-wrap items-center gap-3 text-sm text-muted-foreground sm:flex md:mb-8">
          <Link to="/" className="transition-colors hover:text-[#d4af6e]">
            Início
          </Link>
          <span>/</span>
          <Link to="/produtos" className="transition-colors hover:text-[#d4af6e]">
            Produtos
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <section className="space-y-4">
            <div className="relative overflow-hidden rounded-[2rem] border border-[#252525] bg-[#141414]">
              <img src={images[selectedImage]} alt={product.name} className="aspect-[4/5] w-full object-cover" />
              <div className="absolute left-3 top-3 flex flex-wrap gap-2 sm:left-5 sm:top-5">
                <span className="rounded-full border border-[#d4af6e]/25 bg-black/55 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#f0cf93] backdrop-blur-sm sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.2em]">
                  {product.category}
                </span>

                {displayAvailability === "misto" ? (
                  <>
                    <span className="rounded-full border border-[rgba(37,211,102,0.35)] bg-black/55 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#8ff0b4] backdrop-blur-sm sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.2em]">
                      Disponível
                    </span>
                    <span className="rounded-full border border-[#d4af6e]/35 bg-black/55 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#f0cf93] backdrop-blur-sm sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.2em]">
                      Encomenda
                    </span>
                  </>
                ) : (
                  <span className="rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.2em]">
                    {getDisplayAvailabilityLabel(displayAvailability)}
                  </span>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded-2xl border ${
                      selectedImage === index ? "border-[#d4af6e]" : "border-[#252525]"
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="aspect-square w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-6">
            <Link
              to="/produtos"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[#d4af6e]"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar para o catálogo
            </Link>

            <div>
              <h1 className="mb-3 font-brand text-3xl text-foreground sm:text-4xl md:text-5xl">{product.name}</h1>
              <p className="mb-4 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-relaxed">
                {product.description || "Consulte detalhes e disponibilidade diretamente pelo WhatsApp."}
              </p>
              <p className="text-2xl font-semibold text-gradient-gold sm:text-3xl">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </p>
            </div>

            <div className="rounded-3xl border border-[#252525] bg-[#151515] p-4 sm:p-6">
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#d4af6e]/15 bg-black/20 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#d4af6e]" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">
                    {displayAvailability === "misto"
                      ? "Disponibilidade varia conforme o tamanho"
                      : displayAvailability === "disponivel"
                        ? "Pronta entrega"
                        : "Produção sob encomenda"}
                  </p>
                  <p>
                    {displayAvailability === "misto"
                      ? "Selecione um tamanho para ver com clareza se ele está disponível agora ou se será por encomenda."
                      : displayAvailability === "disponivel"
                        ? "Produto disponível para compra imediata e combinação de entrega."
                        : "Produto produzido sob encomenda. Consulte prazo antes de finalizar."}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f0cf93]">
                  Tamanhos
                </p>
                <div className="flex flex-wrap gap-3">
                  {hasSizes ? (
                    product.sizes.map((size) => {
                      const availability = sizeAvailabilityMap[size] || product.availability;
                      const isSelected = selectedSize === size;

                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[88px] rounded-2xl border px-4 py-3 text-left transition-colors ${
                            isSelected
                              ? availability === "disponivel"
                                ? "border-[#25D366] bg-[rgba(37,211,102,0.12)]"
                                : "border-[#d4af6e] bg-[rgba(212,175,110,0.12)]"
                              : "border-[#2a2a2a] hover:border-[#c9956a]"
                          }`}
                        >
                          <div className="text-sm font-semibold text-foreground">{size}</div>
                          <div
                            className={`mt-1 text-[11px] uppercase tracking-[0.12em] ${
                              availability === "disponivel" ? "text-[#8ff0b4]" : "text-[#f0cf93]"
                            }`}
                          >
                            {getSizeAvailabilityLabel(availability)}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground">Consulte tamanhos pelo WhatsApp.</p>
                  )}
                </div>
              </div>

              {hasSizes && selectedSize && (
                <div
                  className={`mt-5 rounded-2xl border p-4 text-sm ${
                    selectedSizeAvailability === "disponivel"
                      ? "border-[rgba(37,211,102,0.35)] bg-[rgba(37,211,102,0.08)] text-[#bcefcf]"
                      : "border-[#d4af6e]/35 bg-[rgba(212,175,110,0.08)] text-[#f3ddb0]"
                  }`}
                >
                  <p className="font-semibold text-foreground">
                    Tamanho {selectedSize}: {getSizeAvailabilityLabel(selectedSizeAvailability)}
                  </p>
                  <p className="mt-1">
                    {selectedSizeAvailability === "disponivel"
                      ? "Esse tamanho pode seguir para compra imediata."
                      : "Esse tamanho está disponível somente por encomenda. Consulte prazo antes de finalizar."}
                  </p>
                </div>
              )}

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <Button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={hasSizes && !selectedSize}
                  className="h-12 whitespace-nowrap px-5 text-[10px] uppercase tracking-[0.08em] sm:px-6 sm:text-xs sm:tracking-[0.14em]"
                >
                  <ShoppingBag className="h-4 w-4 shrink-0" />
                  <span>
                    {selectedSizeAvailability === "encomenda" ? "Adicionar encomenda" : "Adicionar ao carrinho"}
                  </span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBuyNow}
                  disabled={hasSizes && !selectedSize}
                  className="h-12 whitespace-nowrap border-[#25D366] px-5 text-[10px] uppercase tracking-[0.08em] text-[#25D366] hover:bg-[#25D366] hover:text-white sm:px-6 sm:text-xs sm:tracking-[0.14em]"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  <span>Comprar no WhatsApp</span>
                </Button>
              </div>

              {hasSizes && !selectedSize && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Selecione um tamanho para ver a disponibilidade correta antes de adicionar ou comprar.
                </p>
              )}
            </div>
          </section>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.28em] text-[#f0cf93]">
                  Você também pode gostar
                </p>
                <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                  Mais da categoria {product.category}
                </h2>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {relatedProducts.map((related) => (
                <button
                  key={related.id}
                  type="button"
                  onClick={() => navigate(`/${related.slug}`)}
                  className="overflow-hidden rounded-3xl border border-[#252525] bg-[#141414] text-left transition-all hover:border-[#c9956a]/50"
                >
                  <img
                    src={related.images[0] || related.image_url || "/placeholder.svg"}
                    alt={related.name}
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <div className="space-y-2 p-5">
                    <h3 className="text-lg font-semibold text-foreground">{related.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      R$ {related.price.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProductDetails;
