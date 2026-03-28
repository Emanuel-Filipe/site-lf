import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOMetadata from "@/components/SEOMetadata";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEOMetadata 
        title="Moda Fitness Feminina | LaIs Fitness"
        description="A LaIs Fitness é referência em moda fitness feminina em Mirassol e São José do Rio Preto. Leggings, conjuntos e tops com o melhor caimento e conforto para seu treino."
      />
      <Header />
      <HeroSection />
      <ProductGrid mode="preview" />
      <AboutSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
