import { motion } from "framer-motion";
import BrandLogo from "@/components/BrandLogo";

const AboutSection = () => {
  return (
    <section id="sobre" className="bg-muted py-16 sm:py-20">
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
            <p className="mb-6 text-base leading-7 text-white/90 sm:text-lg sm:leading-relaxed">
              Apaixonada por moda fitness e pelo universo da musculação, a <strong>LaIs Fitness</strong> é uma loja de moda fitness feminina em <strong>Mirassol-SP</strong>, atendendo também <strong>São José do Rio Preto</strong> e região. 
              Nascemos da vontade de oferecer peças com qualidade, conforto e estilo para mulheres que buscam o melhor no treino e no dia a dia.
            </p>
            <p className="text-base leading-7 text-white/90 sm:text-lg sm:leading-relaxed font-light">
              Cada peça é cuidadosamente escolhida pensando no conforto, durabilidade e design, 
              para que você tenha a melhor experiência com nossa <strong>moda fitness em Mirassol</strong>. 
              Sinta-se confiante e poderosa em cada movimento.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
