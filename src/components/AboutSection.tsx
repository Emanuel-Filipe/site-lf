import { motion } from "framer-motion";
import BrandLogo from "@/components/BrandLogo";

const AboutSection = () => {
  return (
    <section id="sobre" className="bg-muted py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-6 flex justify-center">
              <BrandLogo size="md" />
            </div>
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              Apaixonada por moda fitness e pelo universo da musculação, a Lais Fitness nasceu
              da vontade de oferecer peças com qualidade, conforto e estilo para mulheres que
              buscam o melhor no treino e no dia a dia.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Cada peça é cuidadosamente escolhida pensando no conforto, durabilidade e design,
              para que você se sinta confiante e poderosa em cada movimento.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
