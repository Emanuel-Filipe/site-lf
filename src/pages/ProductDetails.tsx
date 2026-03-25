import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ShoppingBag, MessageCircle, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { getProductBySlug, getProducts } from "@/lib/products";
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
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Carregando...</div>;
  }

  if (!product || !product.active) return <NotFound />;

  const images = product.images.length > 0 ? product.images : [product.image_url || "/placeholder.svg"];
  const hasSizes = product.sizes.length > 0;

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) return;

    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: images[selectedImage],
      category: product.category,
      availability: product.availability,
      size: selectedSize,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Olá! Tenho interesse no produto ${product.name}${selectedSize ? `, tamanho ${selectedSize}` : ""}. Pode me ajudar?`
      )}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pb-20 pt-32">
        <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-[#d4af6e]">
            Início
          </Link>
          <span>/</span>
          <Link to="/#produtos" className="transition-colors hover:text-[#d4af6e]">
            Produtos
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-4">
            <div className="relative overflow-hidden rounded-[2rem] border border-[#252525] bg-[#141414]">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#d4af6e]/25 bg-black/55 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#f0cf93] backdrop-blur-sm">
                  {product.category}
                </span>
                <span className="rounded-full border border-white/10 bg-black/55 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
                  {product.availability === "disponivel" ? "Disponível para envio" : "Sob encomenda"}
                </span>
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
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
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[#d4af6e]"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar para a loja
            </Link>

            <div>
              <h1 className="mb-3 font-brand text-5xl text-foreground">{product.name}</h1>
              <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
                {product.description || "Consulte detalhes e disponibilidade diretamente pelo WhatsApp."}
              </p>
              <p className="text-3xl font-semibold text-gradient-gold">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </p>
            </div>

            <div className="rounded-3xl border border-[#252525] bg-[#151515] p-6">
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#d4af6e]/15 bg-black/20 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#d4af6e]" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">
                    {product.availability === "disponivel" ? "Pronta entrega" : "Produção sob encomenda"}
                  </p>
                  <p>
                    {product.availability === "disponivel"
                      ? "Produto disponível para compra imediata e combinação de entrega."
                      : "Produto produzido sob encomenda. Consulte prazo antes de finalizar."}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f0cf93]">
                  Tamanhos disponíveis
                </p>
                <div className="flex flex-wrap gap-3">
                  {hasSizes ? (
                    product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-14 rounded-2xl border px-5 py-3 text-sm font-semibold transition-colors ${
                          selectedSize === size
                            ? "border-[#d4af6e] bg-[#d4af6e] text-black"
                            : "border-[#2a2a2a] text-foreground hover:border-[#c9956a]"
                        }`}
                      >
                        {size}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Consulte tamanhos pelo WhatsApp.</p>
                  )}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={hasSizes && !selectedSize}
                  className="h-12 whitespace-nowrap px-5 text-[10px] uppercase tracking-[0.1em] sm:px-6 sm:text-xs sm:tracking-[0.14em]"
                >
                  <ShoppingBag className="h-4 w-4 shrink-0" />
                  <span>Adicionar ao carrinho</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBuyNow}
                  disabled={hasSizes && !selectedSize}
                  className="h-12 whitespace-nowrap border-[#25D366] px-5 text-[10px] uppercase tracking-[0.1em] text-[#25D366] hover:bg-[#25D366] hover:text-white sm:px-6 sm:text-xs sm:tracking-[0.14em]"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  <span>Comprar no WhatsApp</span>
                </Button>
              </div>

              {hasSizes && !selectedSize && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Selecione um tamanho antes de adicionar ou comprar.
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
                <h2 className="font-display text-4xl text-foreground">Mais da categoria {product.category}</h2>
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
