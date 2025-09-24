import { supabase } from "@/integrations/supabase/client";

export function getTransformedPublicUrl(path: string, width: number, quality = 70, format: "webp" | "avif" = "webp") {
  const { data } = supabase.storage
    .from("images")
    .getPublicUrl(path, {
      transform: { width, quality, format }
    });
  return data.publicUrl;
}

export async function getSignedTransformedUrl(path: string, expiresSeconds = 604800, width = 1600, quality = 70, format: "webp" | "avif" = "webp") {
  const { data, error } = await supabase.storage
    .from("images")
    .createSignedUrl(path, expiresSeconds, {
      transform: { width, quality, format }
    });
  if (error) throw error;
  return data.signedUrl;
}

export const cacheOneYear = "31536000"; // seconds


