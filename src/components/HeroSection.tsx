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
  const images = data?.heroImages?.length ? data.heroImages : [DEFAULT_HERO_IMAGE, "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1920&auto=format&fit=crop"];
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

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25 md:bg-gradient-to-r md:from-black/75 md:via-black/35 md:to-transparent" />

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
          <h1 className="mb-4 font-display text-4xl leading-[0.95] tracking-[0.06em] text-[#E5D3B3] sm:text-5xl md:text-8xl md:tracking-wider">
            MODA FITNESS
            <br />
            <span className="text-accent underline decoration-[#c9956a]/30">FEMININA</span>
          </h1>
          <p className="mb-6 max-w-lg text-base font-light leading-7 text-[#FFF8E7]/80 sm:text-lg md:mb-8">
            {description}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              variant="secondary"
              size="lg"
              className="group relative w-full overflow-hidden border-[#d4af6e]/30 px-10 text-base font-bold tracking-[0.2em] transition-all hover:scale-105 active:scale-95 sm:w-auto sm:text-lg"
              style={{
                background: "linear-gradient(135deg, #a87f4a 0%, #b88a44 50%, #8c6a30 100%)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
              }}
              asChild
            >
              <a href="#produtos">
                <span className="relative z-10 flex items-center justify-center gap-2 text-black">
                  VER COLEÇÃO
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    →
                  </motion.span>
                </span>
                <div className="absolute inset-0 z-0 bg-white/20 transition-transform duration-500 hover:translate-x-full" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
          <motion.div
            key={activeIndex}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 10, ease: "linear" }}
            className="h-full w-full origin-left bg-gradient-to-r from-[#c9956a] to-[#d4af6e] opacity-40 shadow-[0_0_10px_rgba(212,175,110,0.3)]"
          />
        </div>
      )}
    </section>
  );
};

export default HeroSection;
