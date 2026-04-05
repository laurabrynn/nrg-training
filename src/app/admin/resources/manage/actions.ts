"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const role = user.user_metadata?.role;
  if (role !== "do" && role !== "corporate") throw new Error("Unauthorized");
}

export async function createDocument(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const category_label = formData.get("category_label") as string;
  const states = formData.getAll("applicable_states") as string[];

  await admin.from("knowledge_documents").insert({
    title,
    content,
    category,
    category_label,
    applicable_states: states.length > 0 ? states : ["dc", "va", "md", "la"],
    source: "manual",
  });

  revalidatePath("/admin/resources");
  revalidatePath("/admin/resources/manage");
  revalidatePath("/manager/resources");
}

export async function updateDocument(id: string, formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const category_label = formData.get("category_label") as string;
  const states = formData.getAll("applicable_states") as string[];

  await admin.from("knowledge_documents").update({
    title,
    content,
    category,
    category_label,
    applicable_states: states.length > 0 ? states : ["dc", "va", "md", "la"],
  }).eq("id", id);

  revalidatePath("/admin/resources");
  revalidatePath("/admin/resources/manage");
  revalidatePath("/manager/resources");
}

export async function deleteDocument(id: string) {
  await assertAdmin();
  const admin = createAdminClient();
  await admin.from("knowledge_documents").delete().eq("id", id);
  revalidatePath("/admin/resources");
  revalidatePath("/admin/resources/manage");
  revalidatePath("/manager/resources");
}

export async function uploadPdf(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();

  const file = formData.get("file") as File;
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const category_label = formData.get("category_label") as string;
  const states = formData.getAll("applicable_states") as string[];

  if (!file || file.size === 0) throw new Error("No file provided");

  const ext = file.name.split(".").pop();
  const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const bytes = await file.arrayBuffer();

  const { error: uploadError } = await admin.storage
    .from("documents")
    .upload(path, bytes, { contentType: file.type || "application/pdf" });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = admin.storage.from("documents").getPublicUrl(path);

  await admin.from("knowledge_documents").insert({
    title,
    content: "",
    category,
    category_label,
    applicable_states: states.length > 0 ? states : ["dc", "va", "md", "la"],
    source: "pdf",
    file_url: publicUrl,
  });

  revalidatePath("/admin/resources");
  revalidatePath("/admin/resources/manage");
  revalidatePath("/manager/resources");
}
