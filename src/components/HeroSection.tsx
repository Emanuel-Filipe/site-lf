import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DEFAULT_HERO_IMAGE, getStoreSettings } from "@/lib/storeSettings";

const HeroSection = () => {
  const { data } = useQuery({
    queryKey: ["store-settings"],
    queryFn: getStoreSettings,
  });
  const images = data?.heroImages?.length ? data.heroImages : [DEFAULT_HERO_IMAGE];
  const description =
    data?.heroDescription ||
    "Roupas fitness com caimento impecável, visual sofisticado e compra simples pelo WhatsApp.";
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) {
      setActiveIndex(0);
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 10000);

    return () => window.clearInterval(interval);
  }, [images]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {images.map((image, index) => (
        <img
          key={`${image}-${index}`}
          src={image}
          alt="Lais Fitness - Moda Fitness"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
          width={1920}
          height={1080}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />

      <div className="relative z-10 container mx-auto flex h-full items-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl"
        >
          <div className="mb-4 inline-flex rounded-full border border-[#c9956a]/40 bg-black/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#f0cf93] backdrop-blur-sm">
            Moda fitness premium
          </div>
          <h1 className="mb-4 font-display text-6xl leading-none tracking-wider text-primary-foreground md:text-8xl">
            VISTA-SE
            <br />
            <span className="text-accent">DE ATITUDE</span>
          </h1>
          <p className="mb-8 max-w-lg text-lg font-light text-primary-foreground/80">
            {description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" size="lg" className="px-8 text-lg tracking-wider" asChild>
              <a href="#produtos">Ver coleção</a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-[#d4af6e]/40 bg-black/20 px-8 text-lg tracking-wider text-primary-foreground hover:bg-black/30"
              asChild
            >
              <a href="#sobre">Conheça a marca</a>
            </Button>
          </div>

          {images.length > 1 && (
            <div className="mt-8 flex items-center gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeIndex ? "w-10 bg-[#d4af6e]" : "w-2.5 bg-white/35"
                  }`}
                  aria-label={`Ir para banner ${index + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
