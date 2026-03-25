import { supabase } from "@/integrations/supabase/client";

const STORE_BUCKET = "product-images";

const buildFilePath = (folder: string, file: File) => {
  const extension = file.name.includes(".") ? file.name.split(".").pop() || "jpg" : "jpg";
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const safeName = baseName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-");

  return `${folder}/${Date.now()}-${crypto.randomUUID()}-${safeName || "arquivo"}.${extension}`;
};

export const uploadImagesToStorage = async (files: FileList | null, folder: "products" | "hero") => {
  if (!files || files.length === 0) return [];

  const uploads = await Promise.all(
    Array.from(files).map(async (file) => {
      const path = buildFilePath(folder, file);
      const { error } = await supabase.storage.from(STORE_BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) {
        throw error;
      }

      const { data } = supabase.storage.from(STORE_BUCKET).getPublicUrl(path);
      return data.publicUrl;
    })
  );

  return uploads;
};
