"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ProductFields {
  name: string;
  price_inr: number;
  stock: number;
  hsn_code: string;
  gst_rate: number;
  is_active: boolean;
  motif: string;
  region: string;
  occasion: string;
  story: string;
  material: string;
  size: string;
  care: string;
}

export async function updateProduct(slug: string, fields: ProductFields) {
  const sb = await createClient();
  const { error } = await sb
    .from("products")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("slug", slug);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath(`/product/${slug}`);
  revalidatePath("/shop");
  return { ok: true as const };
}
