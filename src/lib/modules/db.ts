import { createAdminClient } from "@/lib/supabase/server";
import type { GmModule, ModuleTask, QuizQuestion } from "./gm-training";

export async function getModulesFromDB(): Promise<GmModule[]> {
  const admin = createAdminClient();

  const [{ data: modules }, { data: tasks }, { data: questions }] = await Promise.all([
    admin.from("gm_modules").select("*").order("sort_order"),
    admin.from("gm_module_tasks").select("*").order("sort_order"),
    admin.from("gm_quiz_questions").select("*").order("sort_order"),
  ]);

  return (modules ?? []).map((mod) => ({
    day: mod.day,
    id: mod.id,
    title: mod.title,
    focus: mod.focus,
    video_url: mod.video_url ?? null,
    content: mod.content ?? null,
    pdf_url: mod.pdf_url ?? null,
    tasks: (tasks ?? [])
      .filter((t) => t.module_id === mod.id)
      .map((t): ModuleTask => ({ text: t.text, duration: t.duration ?? undefined })),
    quiz: (questions ?? [])
      .filter((q) => q.module_id === mod.id)
      .map((q): QuizQuestion => ({
        question: q.question,
        options: q.options,
        correctIndex: q.correct_index,
        explanation: q.explanation,
      })),
  }));
}

export async function getModuleFromDB(day: number): Promise<GmModule | undefined> {
  const modules = await getModulesFromDB();
  return modules.find((m) => m.day === day);
}
