import heroImage from "@/assets/hero-fitness.jpg";
import { supabase } from "@/integrations/supabase/client";

export const DEFAULT_HERO_IMAGE = heroImage;

export type StoreSettings = {
  heroImages: string[];
  heroDescription: string;
  whatsappNumber: string;
  instagramUrl: string;
  storeTagline: string;
  categories: string[];
};

type StoreSettingsRow = {
  id: string;
  hero_images: string[] | null;
  hero_description: string | null;
  whatsapp_number: string | null;
  instagram_url: string | null;
  store_tagline: string | null;
  categories: string[] | null;
};

const defaultSettings: StoreSettings = {
  heroImages: [DEFAULT_HERO_IMAGE, "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1920&auto=format&fit=crop"],
  heroDescription:
    "Roupas fitness com caimento impecável, visual sofisticado e compra simples pelo WhatsApp.",
  whatsappNumber: "5517991755566",
  instagramUrl: "https://www.instagram.com/laismoda_fitness",
  storeTagline: "Moda fitness com atitude",
  categories: ["Conjuntos", "Tops", "Shorts", "Leggings", "Bodys", "Acessórios"],
};

const normalizeSettings = (row?: Partial<StoreSettingsRow> | null): StoreSettings => ({
  heroImages:
    row?.hero_images && row.hero_images.length > 0
      ? row.hero_images.filter(Boolean)
      : defaultSettings.heroImages,
  heroDescription: row?.hero_description?.trim() || defaultSettings.heroDescription,
  whatsappNumber: row?.whatsapp_number?.trim() || defaultSettings.whatsappNumber,
  instagramUrl: row?.instagram_url?.trim() || defaultSettings.instagramUrl,
  storeTagline: row?.store_tagline?.trim() || defaultSettings.storeTagline,
  categories:
    row?.categories && row.categories.length > 0
      ? row.categories.filter(Boolean)
      : defaultSettings.categories,
});

export const getStoreSettings = async () => {
  const { data, error } = await supabase
    .from("store_settings")
    .select("id, hero_images, hero_description, whatsapp_number, instagram_url, store_tagline, categories")
    .eq("id", "main")
    .maybeSingle();

  if (error) {
    console.error("Erro ao carregar configuracoes da loja:", error);
    return defaultSettings;
  }

  return normalizeSettings(data as StoreSettingsRow | null);
};

export const saveStoreSettings = async (settings: StoreSettings) => {
  const normalized = {
    id: "main",
    hero_images: settings.heroImages.filter(Boolean),
    hero_description: settings.heroDescription.trim() || defaultSettings.heroDescription,
    whatsapp_number: settings.whatsappNumber.trim(),
    instagram_url: settings.instagramUrl.trim(),
    store_tagline: settings.storeTagline.trim(),
    categories: settings.categories.filter(Boolean),
  };

  const { error } = await supabase.from("store_settings").upsert(normalized, { onConflict: "id" });

  if (error) {
    throw error;
  }
};
