import { Helmet } from "react-helmet-async";

interface SEOMetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEOMetadata = ({
  title = "Moda Fitness Feminina | LaIs Fitness",
  description = "A LaIs Fitness é uma loja de moda fitness feminina em Mirassol-SP, atendendo também São José do Rio Preto e região. Encontre leggings, conjuntos e tops de alta qualidade.",
  keywords = "moda fitness, legging fitness, conjunto fitness, academia, Mirassol, São José do Rio Preto, roupa de treino feminina",
  image = "/og-image.jpg",
  url = "https://laisfitness.com.br"
}: SEOMetadataProps) => {
  const fullTitle = title.includes("LaIs Fitness") ? title : `${title} | LaIs Fitness`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEOMetadata;
