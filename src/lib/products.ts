import productLegging1 from "@/assets/product-legging-1.jpg";
import productTop1 from "@/assets/product-top-1.jpg";
import productLegging2 from "@/assets/product-legging-2.jpg";
import productConjunto1 from "@/assets/product-conjunto-1.jpg";
import { supabase } from "@/integrations/supabase/client";
import type { PostgrestError } from "@supabase/supabase-js";

export type ProductAvailability = "disponivel" | "encomenda";
export type ProductDisplayAvailability = ProductAvailability | "misto";
export type SizeAvailabilityMap = Record<string, ProductAvailability>;

export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  images: string[];
  sizes: string[];
  size_availability: SizeAvailabilityMap;
  active: boolean;
  availability: ProductAvailability;
  created_at: string;
  updated_at: string;
};

export type StoreProductInput = Omit<StoreProduct, "id" | "created_at" | "updated_at">;

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  images: string[] | null;
  sizes: string[] | null;
  size_availability: SizeAvailabilityMap | null;
  active: boolean;
  availability: ProductAvailability;
  created_at: string;
  updated_at: string;
};

export const slugifyProductName = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const createProduct = (
  partial: Omit<
    StoreProduct,
    "slug" | "images" | "sizes" | "created_at" | "updated_at" | "size_availability"
  > & {
    slug?: string;
    images?: string[];
    sizes?: string[];
    size_availability?: SizeAvailabilityMap;
  }
): StoreProduct => {
  const now = new Date().toISOString();
  const images =
    partial.images && partial.images.length > 0
      ? partial.images
      : partial.image_url
        ? [partial.image_url]
        : ["/placeholder.svg"];

  return {
    ...partial,
    slug: partial.slug || slugifyProductName(partial.name),
    images,
    sizes: partial.sizes || ["P", "M", "G"],
    size_availability: partial.size_availability || {},
    created_at: now,
    updated_at: now,
  };
};

const seedProducts: StoreProduct[] = [
  createProduct({
    id: "11111111-1111-4111-8111-111111111111",
    name: "Conjunto Treino Coral",
    description: "Conjunto versatil para treino com tecido confortavel e modelagem que valoriza o corpo.",
    price: 189.9,
    category: "Conjuntos",
    image_url: productLegging1,
    images: [productLegging1, productConjunto1],
    active: true,
    availability: "disponivel",
    sizes: ["P", "M", "G"],
  }),
  createProduct({
    id: "22222222-2222-4222-8222-222222222222",
    name: "Top Esportivo Coral",
    description: "Top com sustentacao, toque macio e acabamento premium para treinos intensos.",
    price: 89.9,
    category: "Tops",
    image_url: productTop1,
    images: [productTop1],
    active: true,
    availability: "disponivel",
    sizes: ["P", "M", "G"],
  }),
  createProduct({
    id: "33333333-3333-4333-8333-333333333333",
    name: "Legging Cintura Alta Preta",
    description: "Modelagem ajustada, cintura alta e compressao na medida certa para o dia a dia e academia.",
    price: 129.9,
    category: "Leggings",
    image_url: productLegging2,
    images: [productLegging2],
    active: true,
    availability: "encomenda",
    sizes: ["M", "G", "GG"],
  }),
  createProduct({
    id: "44444444-4444-4444-8444-444444444444",
    name: "Conjunto Sport Cinza",
    description: "Conjunto com toque macio e visual sofisticado para quem busca conforto e estilo.",
    price: 169.9,
    category: "Conjuntos",
    image_url: productConjunto1,
    images: [productConjunto1, productLegging1],
    active: true,
    availability: "encomenda",
    sizes: ["P", "M", "G"],
  }),
];

const cloneSeedProducts = () =>
  seedProducts.map((product) => ({
    ...product,
    images: [...product.images],
    sizes: [...product.sizes],
    size_availability: { ...product.size_availability },
  }));

const normalizeSizes = (sizes: string[]) =>
  Array.from(
    new Set(
      sizes
        .map((size) => size.trim().toUpperCase())
        .filter(Boolean)
    )
  );

export const normalizeSizeAvailability = (
  sizes: string[],
  sizeAvailability?: SizeAvailabilityMap | null,
  fallbackAvailability: ProductAvailability = "disponivel"
): SizeAvailabilityMap => {
  const normalizedSizes = normalizeSizes(sizes);
  const normalizedEntries = Object.entries(sizeAvailability || {}).reduce<SizeAvailabilityMap>(
    (acc, [size, availability]) => {
      const normalizedSize = size.trim().toUpperCase();
      if (!normalizedSize || (availability !== "disponivel" && availability !== "encomenda")) {
        return acc;
      }

      acc[normalizedSize] = availability;
      return acc;
    },
    {}
  );

  if (normalizedSizes.length === 0) {
    return normalizedEntries;
  }

  return normalizedSizes.reduce<SizeAvailabilityMap>((acc, size) => {
    acc[size] = normalizedEntries[size] || fallbackAvailability;
    return acc;
  }, {});
};

export const getDisplayAvailability = (
  availability: ProductAvailability,
  sizeAvailability: SizeAvailabilityMap,
  sizes: string[]
): ProductDisplayAvailability => {
  const normalizedMap = normalizeSizeAvailability(sizes, sizeAvailability, availability);
  const sizeValues = sizes.map((size) => normalizedMap[size]).filter(Boolean);

  if (sizeValues.length === 0) {
    return availability;
  }

  const hasAvailable = sizeValues.includes("disponivel");
  const hasMadeToOrder = sizeValues.includes("encomenda");

  if (hasAvailable && hasMadeToOrder) {
    return "misto";
  }

  return hasAvailable ? "disponivel" : "encomenda";
};

export const hasAnyAvailability = (
  availability: ProductAvailability,
  sizeAvailability: SizeAvailabilityMap,
  sizes: string[],
  target: ProductAvailability
) => {
  const normalizedMap = normalizeSizeAvailability(sizes, sizeAvailability, availability);

  if (sizes.length === 0) {
    return availability === target;
  }

  return sizes.some((size) => normalizedMap[size] === target);
};

export const getSizeAvailabilityLabel = (availability: ProductAvailability) =>
  availability === "disponivel" ? "Disponível" : "Encomenda";

export const getDisplayAvailabilityLabel = (availability: ProductDisplayAvailability) => {
  if (availability === "misto") {
    return "Disponível e encomenda";
  }

  return getSizeAvailabilityLabel(availability);
};

export const getAvailabilityDescription = (availability: ProductDisplayAvailability) => {
  if (availability === "misto") {
    return "Alguns tamanhos estão disponíveis agora e outros são por encomenda.";
  }

  return availability === "disponivel"
    ? "Todos os tamanhos cadastrados estão disponíveis agora."
    : "Todos os tamanhos cadastrados são produzidos por encomenda.";
};

export const getSizeAvailabilitySummary = (product: Pick<StoreProduct, "sizes" | "size_availability" | "availability">) => {
  if (product.sizes.length === 0) {
    return "Consulte tamanhos e disponibilidade pelo WhatsApp.";
  }

  const normalizedMap = normalizeSizeAvailability(
    product.sizes,
    product.size_availability,
    product.availability
  );

  const availableSizes = product.sizes.filter((size) => normalizedMap[size] === "disponivel");
  const madeToOrderSizes = product.sizes.filter((size) => normalizedMap[size] === "encomenda");

  if (availableSizes.length === product.sizes.length) {
    return `Tamanhos disponíveis: ${availableSizes.join(", ")}`;
  }

  if (madeToOrderSizes.length === product.sizes.length) {
    return `Tamanhos sob encomenda: ${madeToOrderSizes.join(", ")}`;
  }

  const parts: string[] = [];

  if (availableSizes.length > 0) {
    parts.push(`Disponíveis: ${availableSizes.join(", ")}`);
  }

  if (madeToOrderSizes.length > 0) {
    parts.push(`Encomenda: ${madeToOrderSizes.join(", ")}`);
  }

  return parts.join(" • ");
};

const normalizeProduct = (product: Partial<StoreProduct> & Pick<StoreProduct, "id" | "name" | "price" | "category" | "active" | "availability">): StoreProduct => {
  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.image_url
        ? [product.image_url]
        : ["/placeholder.svg"];
  const sizes = product.sizes && product.sizes.length > 0 ? normalizeSizes(product.sizes) : [];
  const sizeAvailability = normalizeSizeAvailability(sizes, product.size_availability, product.availability);

  return {
    id: product.id,
    slug: product.slug || slugifyProductName(product.name),
    name: product.name,
    description: product.description || null,
    price: Number(product.price),
    category: product.category,
    image_url: product.image_url || images[0] || "/placeholder.svg",
    images,
    sizes,
    size_availability: sizeAvailability,
    active: product.active,
    availability: product.availability,
    created_at: product.created_at || new Date().toISOString(),
    updated_at: product.updated_at || new Date().toISOString(),
  };
};

const mapRowToProduct = (row: ProductRow): StoreProduct =>
  normalizeProduct({
    ...row,
    images: row.images || [],
    sizes: row.sizes || [],
    size_availability: row.size_availability || {},
  });

const normalizeInput = (product: StoreProductInput, id?: string): StoreProduct => {
  const finalId = id || crypto.randomUUID();
  return normalizeProduct({
    ...product,
    id: finalId,
  });
};

const formatProductPersistenceError = (error: PostgrestError) => {
  const errorText = [error.message, error.details, error.hint].filter(Boolean).join(" ").toLowerCase();

  if (errorText.includes("size_availability")) {
    return new Error(
      "O banco de dados ainda nao foi atualizado para a disponibilidade por tamanho. Rode a migration nova no Supabase e tente novamente."
    );
  }

  return error;
};

const seedProductsInDatabase = async () => {
  const payload = seedProducts.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image_url: product.image_url,
    images: product.images,
    sizes: product.sizes,
    size_availability: normalizeSizeAvailability(product.sizes, product.size_availability, product.availability),
    active: product.active,
    availability: product.availability,
  }));

  const { error } = await supabase.from("products").upsert(payload, { onConflict: "id" });

  if (error) {
    console.error("Erro ao popular produtos iniciais no Supabase:", error);
    return cloneSeedProducts();
  }

  return cloneSeedProducts();
};

export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar produtos do Supabase:", error);
    return cloneSeedProducts();
  }

  if (!data || data.length === 0) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      return seedProductsInDatabase();
    }

    return cloneSeedProducts();
  }

  return (data as ProductRow[]).map(mapRowToProduct);
};

export const getProductBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Erro ao carregar produto do Supabase:", error);
    return cloneSeedProducts().find((product) => product.slug === slug) || null;
  }

  if (!data) {
    return cloneSeedProducts().find((product) => product.slug === slug) || null;
  }

  return mapRowToProduct(data as ProductRow);
};

export const saveProduct = async (product: StoreProductInput, id?: string) => {
  const normalized = normalizeInput(product, id);

  // Ensure price is a valid number and handle potential issues
  if (isNaN(normalized.price)) {
    throw new Error("O preço do produto é inválido.");
  }

  const payload = {
    id: normalized.id,
    slug: normalized.slug,
    name: normalized.name,
    description: normalized.description,
    price: normalized.price,
    category: normalized.category,
    image_url: normalized.image_url,
    images: normalized.images,
    sizes: normalized.sizes,
    size_availability: normalized.size_availability,
    active: normalized.active,
    availability: normalized.availability,
  };

  const { error } = await supabase.from("products").upsert(payload, { onConflict: "id" });

  if (error) {
    throw formatProductPersistenceError(error);
  }
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    throw error;
  }
};
