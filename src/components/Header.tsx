import { useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import BrandLogo from "@/components/BrandLogo";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 backdrop-blur-md"
      style={{
        background: "rgba(13,13,13,0.85)",
        borderBottom: "1px solid #1e1e1e",
      }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:h-20">
        <Link to="/" className="shrink-0">
          <BrandLogo size="sm" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {[
            { label: "Produtos", href: "/produtos" },
            { label: "Sobre", href: "/#sobre" },
            { label: "Contato", href: "/#contato" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-sm font-medium tracking-[0.22em] transition-colors"
              style={{ color: "#777" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#d4af6e";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#777";
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={openCart}
            className="relative flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition-all md:gap-1.5 md:px-3"
            style={{
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              color: "#d4af6e",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#c9956a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#2a2a2a";
            }}
          >
            <ShoppingBag className="h-4 w-4" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    background: "linear-gradient(135deg, #c9956a, #d4af6e)",
                    color: "#000",
                  }}
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            className="rounded-lg p-1 transition-colors md:hidden"
            style={{ color: "#888" }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden md:hidden"
            style={{ borderBottom: "1px solid #1e1e1e", background: "#0d0d0d" }}
          >
            <nav className="flex flex-col gap-4 px-4 py-4">
              {[
                { label: "Produtos", href: "/produtos" },
                { label: "Sobre", href: "/#sobre" },
                { label: "Contato", href: "/#contato" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium tracking-[0.18em] transition-colors"
                  style={{ color: "#666" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#d4af6e";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#666";
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
