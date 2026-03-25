import { useEffect } from "react";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const ProductCatalog = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28">
        <ProductGrid mode="catalog" />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProductCatalog;
