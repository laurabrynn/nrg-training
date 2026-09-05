import { createAdminClient } from "@/lib/supabase/server";

export interface ConceptModuleTask {
  id: string;
  text: string;
  duration: string | null;
  link_url: string | null;
  file_url: string | null;
  sort_order: number;
}

export interface ConceptQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ConceptModule {
  id: string;
  concept_id: string;
  staff_role: string;
  day: number;
  title: string;
  focus: string;
  content: string | null;
  video_url: string | null;
  pdf_url: string | null;
  sort_order: number;
  tasks: ConceptModuleTask[];
  quiz: ConceptQuizQuestion[];
}

export async function getConceptModulesFull(conceptId: string): Promise<ConceptModule[]> {
  const admin = createAdminClient();
  const [{ data: modules }, { data: tasks }, { data: questions }] = await Promise.all([
    admin.from("concept_modules").select("*").eq("concept_id", conceptId).order("staff_role").order("sort_order"),
    admin.from("concept_module_tasks").select("*").order("sort_order"),
    admin.from("concept_quiz_questions").select("*").order("sort_order"),
  ]);

  return (modules ?? []).map((mod) => ({
    id: mod.id,
    concept_id: mod.concept_id,
    staff_role: mod.staff_role,
    day: mod.day,
    title: mod.title,
    focus: mod.focus,
    content: mod.content ?? null,
    video_url: mod.video_url ?? null,
    pdf_url: mod.pdf_url ?? null,
    sort_order: mod.sort_order,
    tasks: (tasks ?? []).filter((t) => t.module_id === mod.id).map((t) => ({
      id: t.id,
      text: t.text,
      duration: t.duration ?? null,
      link_url: t.link_url ?? null,
      file_url: t.file_url ?? null,
      sort_order: t.sort_order,
    })),
    quiz: (questions ?? []).filter((q) => q.module_id === mod.id).map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctIndex: q.correct_index,
      explanation: q.explanation,
    })),
  }));
}

export async function getConceptModuleForRole(conceptId: string, role: string): Promise<ConceptModule[]> {
  const admin = createAdminClient();
  const [{ data: modules }, { data: tasks }, { data: questions }] = await Promise.all([
    admin.from("concept_modules").select("*").eq("concept_id", conceptId).eq("staff_role", role).order("sort_order"),
    admin.from("concept_module_tasks").select("*").order("sort_order"),
    admin.from("concept_quiz_questions").select("*").order("sort_order"),
  ]);

  return (modules ?? []).map((mod) => ({
    id: mod.id,
    concept_id: mod.concept_id,
    staff_role: mod.staff_role,
    day: mod.day,
    title: mod.title,
    focus: mod.focus,
    content: mod.content ?? null,
    video_url: mod.video_url ?? null,
    pdf_url: mod.pdf_url ?? null,
    sort_order: mod.sort_order,
    tasks: (tasks ?? []).filter((t) => t.module_id === mod.id).map((t) => ({
      id: t.id,
      text: t.text,
      duration: t.duration ?? null,
      link_url: t.link_url ?? null,
      file_url: t.file_url ?? null,
      sort_order: t.sort_order,
    })),
    quiz: (questions ?? []).filter((q) => q.module_id === mod.id).map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctIndex: q.correct_index,
      explanation: q.explanation,
    })),
  }));
}

export async function getConceptModuleById(moduleId: string): Promise<ConceptModule | null> {
  const admin = createAdminClient();
  const [{ data: mod }, { data: tasks }, { data: questions }] = await Promise.all([
    admin.from("concept_modules").select("*").eq("id", moduleId).single(),
    admin.from("concept_module_tasks").select("*").eq("module_id", moduleId).order("sort_order"),
    admin.from("concept_quiz_questions").select("*").eq("module_id", moduleId).order("sort_order"),
  ]);

  if (!mod) return null;

  return {
    id: mod.id,
    concept_id: mod.concept_id,
    staff_role: mod.staff_role,
    day: mod.day,
    title: mod.title,
    focus: mod.focus,
    content: mod.content ?? null,
    video_url: mod.video_url ?? null,
    pdf_url: mod.pdf_url ?? null,
    sort_order: mod.sort_order,
    tasks: (tasks ?? []).map((t) => ({
      id: t.id,
      text: t.text,
      duration: t.duration ?? null,
      link_url: t.link_url ?? null,
      file_url: t.file_url ?? null,
      sort_order: t.sort_order,
    })),
    quiz: (questions ?? []).map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctIndex: q.correct_index,
      explanation: q.explanation,
    })),
  };
}
