import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/contexts/CartContext";
import { getStoreSettings } from "@/lib/storeSettings";

const WHATSAPP_MESSAGE = "Olá! Vim pelo site da Lais Fitness e gostaria de saber mais!";

const WhatsAppButton = () => {
  const { isOpen } = useCart();
  
  const { data: settings } = useQuery({
    queryKey: ["store-settings"],
    queryFn: getStoreSettings,
  });

  const whatsappNumber = settings?.whatsappNumber || "5517991755566";
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  if (isOpen) return null;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      className="fixed bottom-6 right-6 z-50 rounded-full bg-[#25D366] p-4 text-[#fff] shadow-lg transition-shadow hover:bg-[#20BD5A] hover:shadow-xl"
      aria-label="Conversar no WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </motion.a>
  );
};

export default WhatsAppButton;
