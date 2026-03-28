import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOMetadata from "@/components/SEOMetadata";

interface CategoryLandingProps {
  category?: string;
}

const CategoryLanding = ({ category: propCategory }: CategoryLandingProps) => {
  const { category: urlCategory } = useParams();
  const category = propCategory || urlCategory || "";
  
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [category]);

  // Map slugs to display names and SEO content
  const categoryMap: Record<string, { name: string, title: string, description: string }> = {
    "legging-fitness": {
      name: "Leggings",
      title: "Leggings Fitness Femininas | LaIs Fitness Mirassol",
      description: "As melhores leggings fitness para o seu treino você encontra na LaIs Fitness. Modelos com compressão, conforto e estilo em Mirassol e região."
    },
    "conjunto-fitness-feminino": {
      name: "Conjuntos",
      title: "Conjuntos Fitness Femininos | LaIs Fitness Mirassol",
      description: "Conjuntos fitness impecáveis para academia e treino. Variedade de cores e tecidos premium na LaIs Fitness em Mirassol-SP."
    },
    "tops-fitness": {
      name: "Tops",
      title: "Tops Fitness Femininos | LaIs Fitness Mirassol",
      description: "Sustentação e estilo com nossos tops fitness. Ideais para musculação, crossfit e dia a dia. Atendemos Mirassol e RP."
    },
    "moda-fitness-mirassol": {
      name: "Todos",
      title: "Moda Fitness em Mirassol - SP | LaIs Fitness",
      description: "A LaIs Fitness é a sua melhor opção de moda fitness em Mirassol e São José do Rio Preto. Roupas de academia com qualidade premium e atendimento via WhatsApp."
    }
  };

  const currentCategory = categoryMap[category] || {
    name: "Todos",
    title: "Moda Fitness Feminina | LaIs Fitness",
    description: "Confira nossa coleção completa de moda fitness feminina. Entregamos em Mirassol, São José do Rio Preto e região."
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOMetadata 
        title={currentCategory.title}
        description={currentCategory.description}
        keywords={`${currentCategory.name}, moda fitness, Mirassol, São José do Rio Preto, legging, conjunto fitness`}
      />
      <Header />
      <main className="pt-28">
        <div className="container mx-auto px-4 mb-8">
          <h1 className="font-display text-4xl tracking-[0.08em] text-foreground sm:text-5xl uppercase">
            {currentCategory.name === "Todos" ? "Moda Fitness Mirassol" : currentCategory.name}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#8f8b84] sm:text-lg max-w-3xl">
            {currentCategory.description}
          </p>
        </div>
        <ProductGrid mode="catalog" initialCategory={currentCategory.name} />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default CategoryLanding;
