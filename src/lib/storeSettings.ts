import heroImage from "@/assets/hero-fitness.jpg";

export const DEFAULT_HERO_IMAGE = heroImage;

export type StoreSettings = {
  heroImages: string[];
  heroDescription: string;
};

const STORAGE_KEY = "lais-fitness-store-settings";

const defaultSettings: StoreSettings = {
  heroImages: [DEFAULT_HERO_IMAGE],
  heroDescription:
    "Roupas fitness com caimento impecável, visual sofisticado e compra simples pelo WhatsApp.",
};

export const getStoreSettings = async () => {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
    return defaultSettings;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<StoreSettings>;
    const normalized: StoreSettings = {
      heroImages:
        parsed.heroImages && parsed.heroImages.length > 0
          ? parsed.heroImages.filter(Boolean)
          : defaultSettings.heroImages,
      heroDescription: parsed.heroDescription?.trim() || defaultSettings.heroDescription,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
    return defaultSettings;
  }
};

export const saveStoreSettings = async (settings: StoreSettings) => {
  const normalized: StoreSettings = {
    heroImages: settings.heroImages.filter(Boolean),
    heroDescription: settings.heroDescription.trim() || defaultSettings.heroDescription,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
};
