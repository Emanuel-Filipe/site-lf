import heroImage from "@/assets/hero-fitness.jpg";
import { supabase } from "@/integrations/supabase/client";

export const DEFAULT_HERO_IMAGE = heroImage;

export type StoreSettings = {
  heroImages: string[];
  heroDescription: string;
};

type StoreSettingsRow = {
  id: string;
  hero_images: string[] | null;
  hero_description: string | null;
};

const defaultSettings: StoreSettings = {
  heroImages: [DEFAULT_HERO_IMAGE],
  heroDescription:
    "Roupas fitness com caimento impecável, visual sofisticado e compra simples pelo WhatsApp.",
};

const normalizeSettings = (row?: Partial<StoreSettingsRow> | null): StoreSettings => ({
  heroImages:
    row?.hero_images && row.hero_images.length > 0
      ? row.hero_images.filter(Boolean)
      : defaultSettings.heroImages,
  heroDescription: row?.hero_description?.trim() || defaultSettings.heroDescription,
});

export const getStoreSettings = async () => {
  const { data, error } = await supabase
    .from("store_settings")
    .select("id, hero_images, hero_description")
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
  };

  const { error } = await supabase.from("store_settings").upsert(normalized, { onConflict: "id" });

  if (error) {
    throw error;
  }
};
