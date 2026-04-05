import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { gmModules } from "@/lib/modules/gm-training";

export const metadata = { title: "GM Training Program | NRG Training" };

export default async function GMTrainingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: progressRows } = await supabase
    .from("module_progress")
    .select("module_id, completed_at, signed_off_at")
    .eq("user_id", user.id);

  const { data: taskRows } = await supabase
    .from("module_task_completions")
    .select("module_id, task_index")
    .eq("user_id", user.id);

  const { data: quizRows } = await supabase
    .from("quiz_attempts")
    .select("module_id, score")
    .eq("user_id", user.id);

  // Best score per module
  const quizScoreMap = new Map<string, number>();
  for (const q of quizRows ?? []) {
    const prev = quizScoreMap.get(q.module_id) ?? -1;
    if (q.score > prev) quizScoreMap.set(q.module_id, q.score);
  }

  const progressMap = new Map(
    (progressRows ?? []).map((p) => [p.module_id, p])
  );
  const taskMap = new Map<string, number>();
  for (const t of taskRows ?? []) {
    taskMap.set(t.module_id, (taskMap.get(t.module_id) ?? 0) + 1);
  }

  const completedDays = (progressRows ?? []).filter((p) => p.completed_at).length;
  const signedOffDays = (progressRows ?? []).filter((p) => p.signed_off_at).length;
  const totalDays = gmModules.length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-nrg-charcoal">GM Training Program</h1>
        <p className="text-gray-500 text-sm mt-1">
          10-day onboarding program for general managers.
        </p>
      </div>

      {/* Progress summary */}
      <div className="bg-nrg-green text-white rounded-2xl p-6 mb-8">
        <h2 className="font-semibold text-nrg-gold mb-4">Your Progress</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{completedDays}<span className="text-white/50 text-base">/{totalDays}</span></p>
            <p className="text-xs text-white/70 mt-0.5">Days complete</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{signedOffDays}<span className="text-white/50 text-base">/{totalDays}</span></p>
            <p className="text-xs text-white/70 mt-0.5">Signed off</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {Math.round((completedDays / totalDays) * 100)}<span className="text-white/50 text-base">%</span>
            </p>
            <p className="text-xs text-white/70 mt-0.5">Complete</p>
          </div>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-nrg-gold rounded-full transition-all"
            style={{ width: `${Math.round((completedDays / totalDays) * 100)}%` }}
          />
        </div>
      </div>

      {/* Day cards */}
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
        10-Day Program
      </h2>
      <div className="space-y-2">
        {gmModules.map((mod) => {
          const prog = progressMap.get(mod.id);
          const isComplete = !!prog?.completed_at;
          const isSigned = !!prog?.signed_off_at;
          const completedTasks = taskMap.get(mod.id) ?? 0;
          const totalTasks = mod.tasks.length;
          const pct = Math.round((completedTasks / totalTasks) * 100);
          const quizScore = quizScoreMap.get(mod.id) ?? null;

          return (
            <Link
              key={mod.id}
              href={`/manager/gm-training/day/${mod.day}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition group"
            >
              {/* Status circle */}
              <span className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition ${
                isComplete ? "bg-nrg-green text-white" : "bg-gray-100 text-gray-400 group-hover:bg-nrg-green/10 group-hover:text-nrg-green"
              }`}>
                {isComplete ? "✓" : mod.day}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm text-nrg-charcoal">{mod.title}</p>
                  {isSigned && (
                    <span className="text-xs bg-nrg-gold/15 text-nrg-gold rounded-full px-2 py-0.5">
                      Signed off
                    </span>
                  )}
                  {quizScore !== null && (
                    <span className={`text-xs rounded-full px-2 py-0.5 ${
                      quizScore >= 80
                        ? "bg-nrg-green/10 text-nrg-green"
                        : "bg-orange-50 text-orange-500"
                    }`}>
                      Quiz {quizScore}%
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-nrg-green rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {completedTasks}/{totalTasks}
                  </span>
                </div>
              </div>

              <span className="text-xs text-nrg-gold flex-shrink-0">Open →</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
