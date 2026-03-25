import productLegging1 from "@/assets/product-legging-1.jpg";
import productTop1 from "@/assets/product-top-1.jpg";
import productLegging2 from "@/assets/product-legging-2.jpg";
import productConjunto1 from "@/assets/product-conjunto-1.jpg";
import { supabase } from "@/integrations/supabase/client";

export type ProductAvailability = "disponivel" | "encomenda";

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
    "slug" | "images" | "sizes" | "created_at" | "updated_at"
  > & {
    slug?: string;
    images?: string[];
    sizes?: string[];
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
    created_at: now,
    updated_at: now,
  };
};

const seedProducts: StoreProduct[] = [
  createProduct({
    id: "1",
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
    id: "2",
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
    id: "3",
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
    id: "4",
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
  seedProducts.map((product) => ({ ...product, images: [...product.images], sizes: [...product.sizes] }));

const normalizeProduct = (product: Partial<StoreProduct> & Pick<StoreProduct, "id" | "name" | "price" | "category" | "active" | "availability">): StoreProduct => {
  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.image_url
        ? [product.image_url]
        : ["/placeholder.svg"];

  return {
    id: product.id,
    slug: product.slug || slugifyProductName(product.name),
    name: product.name,
    description: product.description || null,
    price: Number(product.price),
    category: product.category,
    image_url: product.image_url || images[0] || "/placeholder.svg",
    images,
    sizes: product.sizes && product.sizes.length > 0 ? product.sizes : [],
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
  });

const normalizeInput = (product: StoreProductInput, id?: string) =>
  normalizeProduct({
    ...product,
    id: id || crypto.randomUUID(),
  });

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
  const normalizedInput = normalizeInput(product, id);
  const payload = {
    id: id || normalizedInput.id,
    slug: normalizedInput.slug,
    name: normalizedInput.name,
    description: normalizedInput.description,
    price: normalizedInput.price,
    category: normalizedInput.category,
    image_url: normalizedInput.images[0] || normalizedInput.image_url || "/placeholder.svg",
    images: normalizedInput.images,
    sizes: normalizedInput.sizes,
    active: normalizedInput.active,
    availability: normalizedInput.availability,
  };

  const { error } = await supabase.from("products").upsert(payload, { onConflict: "id" });

  if (error) {
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    throw error;
  }
};
