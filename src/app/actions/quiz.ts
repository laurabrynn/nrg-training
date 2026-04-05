"use server";

import { createClient } from "@/lib/supabase/server";

export async function saveQuizAttempt(
  moduleId: string,
  score: number,
  correctCount: number,
  totalQuestions: number
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("quiz_attempts").insert({
    user_id: user.id,
    module_id: moduleId,
    score,
    correct_count: correctCount,
    total_questions: totalQuestions,
  });
}
