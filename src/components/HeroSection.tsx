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
    <section className="relative min-h-[100svh] w-full overflow-hidden">
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

      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/45 to-foreground/20 md:bg-gradient-to-r md:from-foreground/70 md:via-foreground/40 md:to-transparent" />

      <div className="relative z-10 container mx-auto flex min-h-[100svh] items-end px-4 pb-12 pt-28 md:items-center md:pb-0 md:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl"
        >
          <div className="mb-4 inline-flex rounded-full border border-[#c9956a]/40 bg-black/25 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f0cf93] backdrop-blur-sm sm:px-4 sm:text-xs sm:tracking-[0.26em]">
            Moda fitness premium
          </div>
          <h1 className="mb-4 font-display text-4xl leading-[0.95] tracking-[0.06em] text-primary-foreground sm:text-5xl md:text-8xl md:tracking-wider">
            VISTA-SE
            <br />
            <span className="text-accent">DE ATITUDE</span>
          </h1>
          <p className="mb-6 max-w-lg text-base font-light leading-7 text-primary-foreground/80 sm:text-lg md:mb-8">
            {description}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button variant="secondary" size="lg" className="w-full px-6 text-base tracking-[0.14em] sm:w-auto sm:px-8 sm:text-lg sm:tracking-wider" asChild>
              <a href="#produtos">Ver coleção</a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full border-[#d4af6e]/40 bg-black/20 px-6 text-base tracking-[0.14em] text-primary-foreground hover:bg-black/30 sm:w-auto sm:px-8 sm:text-lg sm:tracking-wider"
              asChild
            >
              <a href="#sobre">Conheça a marca</a>
            </Button>
          </div>

          {images.length > 1 && (
            <div className="mt-6 flex items-center gap-2 md:mt-8">
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
