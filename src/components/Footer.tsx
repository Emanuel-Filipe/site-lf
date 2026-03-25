import { Instagram } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

const Footer = () => {
  return (
    <footer id="contato" className="bg-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <div className="mb-3">
              <BrandLogo size="sm" />
            </div>
            <p className="text-sm text-primary-foreground/60">Moda fitness com atitude</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground/60 transition-colors hover:text-accent"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/10 pt-8 text-center">
          <p className="text-sm text-primary-foreground/40">
            Lais Fitness (c) {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
