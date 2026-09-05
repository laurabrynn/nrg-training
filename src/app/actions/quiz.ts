"use server";

import { createClient } from "@/lib/supabase/server";

export async function saveQuizAttempt(
  moduleId: string,
  score: number,
  correctCount: number,
  totalQuestions: number,
  table: string = "quiz_attempts"
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const row: Record<string, unknown> = { user_id: user.id, module_id: moduleId, score };
  if (table === "quiz_attempts") {
    row.correct_count = correctCount;
    row.total_questions = totalQuestions;
  }

  await supabase.from(table).insert(row);
}
