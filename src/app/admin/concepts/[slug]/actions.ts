"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function assertCanEdit() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const role = user.user_metadata?.role;
  if (!["do", "corporate", "manager"].includes(role)) throw new Error("Unauthorized");
  return user;
}

function revalidateConcept(slug: string) {
  revalidatePath(`/admin/concepts/${slug}`);
  revalidatePath("/admin/concepts");
}

export async function createConceptModule(conceptId: string, slug: string, formData: FormData) {
  const user = await assertCanEdit();
  const admin = createAdminClient();

  const role = user.user_metadata?.role;
  if (role === "manager") {
    const userConceptId = user.user_metadata?.concept_id;
    if (userConceptId !== conceptId) throw new Error("Unauthorized");
  }

  const day = parseInt(formData.get("day") as string) || 1;
  const title = formData.get("title") as string;
  const focus = formData.get("focus") as string;
  const staffRole = formData.get("staff_role") as string;

  const { data, error } = await admin.from("concept_modules").insert({
    concept_id: conceptId,
    staff_role: staffRole,
    day,
    title,
    focus,
    sort_order: day,
  }).select("id").single();

  if (error) throw error;
  revalidateConcept(slug);
  redirect(`/admin/concepts/${slug}/modules/${data.id}`);
}

export async function updateConceptModule(id: string, slug: string, title: string, focus: string, videoUrl: string, content: string, pdfUrl: string) {
  await assertCanEdit();
  const admin = createAdminClient();
  await admin.from("concept_modules").update({
    title,
    focus,
    video_url: videoUrl || null,
    content: content || null,
    pdf_url: pdfUrl || null,
  }).eq("id", id);
  revalidateConcept(slug);
}

export async function deleteConceptModule(id: string, slug: string) {
  await assertCanEdit();
  const admin = createAdminClient();
  await admin.from("concept_modules").delete().eq("id", id);
  revalidateConcept(slug);
  redirect(`/admin/concepts/${slug}`);
}

export async function uploadConceptModulePdf(moduleId: string, formData: FormData): Promise<string> {
  await assertCanEdit();
  const admin = createAdminClient();
  const file = formData.get("file") as File;
  if (!file || file.size === 0) throw new Error("No file provided");
  const path = `concept-modules/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const bytes = await file.arrayBuffer();
  const { error } = await admin.storage.from("documents").upload(path, bytes, { contentType: file.type || "application/pdf" });
  if (error) throw error;
  const { data: { publicUrl } } = admin.storage.from("documents").getPublicUrl(path);
  await admin.from("concept_modules").update({ pdf_url: publicUrl }).eq("id", moduleId);
  return publicUrl;
}

export async function addConceptTask(moduleId: string, slug: string, text: string, duration: string, linkUrl: string, fileUrl: string) {
  await assertCanEdit();
  const admin = createAdminClient();
  const { data: existing } = await admin.from("concept_module_tasks").select("sort_order").eq("module_id", moduleId).order("sort_order", { ascending: false }).limit(1);
  const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1;
  await admin.from("concept_module_tasks").insert({
    module_id: moduleId,
    text,
    duration: duration || null,
    link_url: linkUrl || null,
    file_url: fileUrl || null,
    sort_order: nextOrder,
  });
  revalidateConcept(slug);
}

export async function updateConceptTask(id: string, slug: string, text: string, duration: string, linkUrl: string, fileUrl: string) {
  await assertCanEdit();
  const admin = createAdminClient();
  await admin.from("concept_module_tasks").update({
    text,
    duration: duration || null,
    link_url: linkUrl || null,
    file_url: fileUrl || null,
  }).eq("id", id);
  revalidateConcept(slug);
}

export async function deleteConceptTask(id: string, slug: string) {
  await assertCanEdit();
  const admin = createAdminClient();
  await admin.from("concept_module_tasks").delete().eq("id", id);
  revalidateConcept(slug);
}

export async function uploadConceptTaskPdf(taskId: string, formData: FormData): Promise<string> {
  await assertCanEdit();
  const admin = createAdminClient();
  const file = formData.get("file") as File;
  if (!file || file.size === 0) throw new Error("No file");
  const path = `concept-tasks/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const bytes = await file.arrayBuffer();
  const { error } = await admin.storage.from("documents").upload(path, bytes, { contentType: file.type || "application/pdf" });
  if (error) throw error;
  const { data: { publicUrl } } = admin.storage.from("documents").getPublicUrl(path);
  await admin.from("concept_module_tasks").update({ file_url: publicUrl }).eq("id", taskId);
  return publicUrl;
}

export async function addConceptQuestion(moduleId: string, slug: string, question: string, options: string[], correctIndex: number, explanation: string) {
  await assertCanEdit();
  const admin = createAdminClient();
  const { data: existing } = await admin.from("concept_quiz_questions").select("sort_order").eq("module_id", moduleId).order("sort_order", { ascending: false }).limit(1);
  const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1;
  await admin.from("concept_quiz_questions").insert({ module_id: moduleId, question, options, correct_index: correctIndex, explanation, sort_order: nextOrder });
  revalidateConcept(slug);
}

export async function updateConceptQuestion(id: string, slug: string, question: string, options: string[], correctIndex: number, explanation: string) {
  await assertCanEdit();
  const admin = createAdminClient();
  await admin.from("concept_quiz_questions").update({ question, options, correct_index: correctIndex, explanation }).eq("id", id);
  revalidateConcept(slug);
}

export async function deleteConceptQuestion(id: string, slug: string) {
  await assertCanEdit();
  const admin = createAdminClient();
  await admin.from("concept_quiz_questions").delete().eq("id", id);
  revalidateConcept(slug);
}
