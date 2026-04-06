"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role;
  if (role !== "corporate" && role !== "do") throw new Error("Unauthorized");
}

export async function updateModule(
  id: string,
  title: string,
  focus: string,
  videoUrl: string,
  content: string,
  pdfUrl: string,
) {
  await assertAdmin();
  const admin = createAdminClient();
  await admin.from("gm_modules").update({
    title,
    focus,
    video_url: videoUrl || null,
    content: content || null,
    pdf_url: pdfUrl || null,
  }).eq("id", id);
  revalidatePath("/admin/modules");
  revalidatePath("/manager/gm-training");
}

export async function uploadModulePdf(moduleId: string, formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();

  const file = formData.get("file") as File;
  if (!file || file.size === 0) throw new Error("No file provided");

  const path = `modules/${moduleId}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const bytes = await file.arrayBuffer();

  const { error: uploadError } = await admin.storage
    .from("documents")
    .upload(path, bytes, { contentType: file.type || "application/pdf" });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = admin.storage.from("documents").getPublicUrl(path);

  await admin.from("gm_modules").update({ pdf_url: publicUrl }).eq("id", moduleId);
  revalidatePath("/admin/modules");
  revalidatePath("/manager/gm-training");

  return publicUrl;
}

export async function addTask(moduleId: string, text: string, duration: string) {
  await assertAdmin();
  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("gm_module_tasks")
    .select("sort_order")
    .eq("module_id", moduleId)
    .order("sort_order", { ascending: false })
    .limit(1);
  const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1;
  await admin.from("gm_module_tasks").insert({
    module_id: moduleId,
    text,
    duration: duration || null,
    sort_order: nextOrder,
  });
  revalidatePath("/admin/modules");
  revalidatePath("/manager/gm-training");
}

export async function updateTask(id: string, text: string, duration: string) {
  await assertAdmin();
  const admin = createAdminClient();
  await admin.from("gm_module_tasks").update({ text, duration: duration || null }).eq("id", id);
  revalidatePath("/admin/modules");
  revalidatePath("/manager/gm-training");
}

export async function deleteTask(id: string) {
  await assertAdmin();
  const admin = createAdminClient();
  await admin.from("gm_module_tasks").delete().eq("id", id);
  revalidatePath("/admin/modules");
  revalidatePath("/manager/gm-training");
}

export async function addQuestion(
  moduleId: string,
  question: string,
  options: string[],
  correctIndex: number,
  explanation: string,
) {
  await assertAdmin();
  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("gm_quiz_questions")
    .select("sort_order")
    .eq("module_id", moduleId)
    .order("sort_order", { ascending: false })
    .limit(1);
  const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1;
  await admin.from("gm_quiz_questions").insert({
    module_id: moduleId,
    question,
    options,
    correct_index: correctIndex,
    explanation,
    sort_order: nextOrder,
  });
  revalidatePath("/admin/modules");
}

export async function updateQuestion(
  id: string,
  question: string,
  options: string[],
  correctIndex: number,
  explanation: string,
) {
  await assertAdmin();
  const admin = createAdminClient();
  await admin.from("gm_quiz_questions").update({
    question,
    options,
    correct_index: correctIndex,
    explanation,
  }).eq("id", id);
  revalidatePath("/admin/modules");
}

export async function deleteQuestion(id: string) {
  await assertAdmin();
  const admin = createAdminClient();
  await admin.from("gm_quiz_questions").delete().eq("id", id);
  revalidatePath("/admin/modules");
}
