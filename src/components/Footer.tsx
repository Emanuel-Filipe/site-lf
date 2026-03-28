import { Instagram, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BrandLogo from "@/components/BrandLogo";
import { getStoreSettings } from "@/lib/storeSettings";

const Footer = () => {
  const { data: settings } = useQuery({
    queryKey: ["store-settings"],
    queryFn: getStoreSettings,
  });

  const instagramUrl = settings?.instagramUrl || "https://www.instagram.com/laismoda_fitness";
  const tagline = settings?.storeTagline || "Moda fitness com atitude";

  return (
    <footer id="contato" className="border-t border-border bg-card/50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
            <Link to="/">
              <BrandLogo size="sm" />
            </Link>
            <p className="max-w-[280px] text-sm text-foreground/80 lowercase">
              {tagline} — moda fitness premium em mirassol/sp
            </p>
            <p className="text-[10px] uppercase tracking-widest text-foreground/40">
              Mirassol • São José do Rio Preto • Região
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 transition-colors hover:text-[#d4af6e]"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <Link
              to="/admin"
              className="text-foreground/70 transition-colors hover:text-[#d4af6e]"
            >
              <Send className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
