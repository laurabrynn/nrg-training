import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getModule, gmModules } from "@/lib/modules/gm-training";
import TaskChecklist from "@/components/modules/TaskChecklist";
import ModuleNotes from "@/components/modules/ModuleNotes";
import SignOff from "@/components/modules/SignOff";
import Quiz from "@/components/modules/Quiz";

export async function generateStaticParams() {
  return gmModules.map((m) => ({ day: String(m.day) }));
}

export async function generateMetadata({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;
  const mod = getModule(Number(day));
  return { title: mod ? `Day ${mod.day}: ${mod.title} | NRG Training` : "Not Found" };
}

export default async function ModulePage({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;
  const mod = getModule(Number(day));
  if (!mod) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  // Load this user's progress for this module
  const { data: progress } = await supabase
    .from("module_progress")
    .select("*, signed_off_by_user:signed_off_by(raw_user_meta_data)")
    .eq("user_id", user.id)
    .eq("module_id", mod.id)
    .maybeSingle();

  const { data: taskCompletions } = await supabase
    .from("module_task_completions")
    .select("task_index")
    .eq("user_id", user.id)
    .eq("module_id", mod.id);

  const completedTasks = new Set((taskCompletions ?? []).map((t) => t.task_index));

  // Best quiz score for this module
  const { data: quizAttempts } = await supabase
    .from("quiz_attempts")
    .select("score")
    .eq("user_id", user.id)
    .eq("module_id", mod.id)
    .order("score", { ascending: false })
    .limit(1);

  const bestScore = quizAttempts?.[0]?.score ?? null;

  const prevDay = mod.day > 1 ? mod.day - 1 : null;
  const nextDay = mod.day < gmModules.length ? mod.day + 1 : null;

  const signedOff = !!progress?.signed_off_at;
  const isComplete = !!progress?.completed_at;

  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/manager/gm-training" className="hover:text-nrg-green transition">
          GM Training
        </Link>
        <span>/</span>
        <span className="text-nrg-charcoal font-medium">Day {mod.day}</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <span className="flex-shrink-0 w-12 h-12 rounded-full bg-nrg-green text-white text-lg font-bold flex items-center justify-center">
          {mod.day}
        </span>
        <div>
          <h1 className="text-2xl font-bold text-nrg-charcoal">{mod.title}</h1>
          <p className="text-gray-500 text-sm mt-1">{mod.focus}</p>
        </div>
        {(isComplete || signedOff) && (
          <div className="ml-auto flex flex-col items-end gap-1">
            {isComplete && (
              <span className="text-xs bg-green-100 text-green-700 rounded-full px-3 py-1 font-medium">
                Completed
              </span>
            )}
            {signedOff && (
              <span className="text-xs bg-nrg-gold/15 text-nrg-gold rounded-full px-3 py-1 font-medium">
                Signed off
              </span>
            )}
          </div>
        )}
      </div>

      {/* Task Checklist */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Tasks
        </h2>
        <TaskChecklist
          userId={user.id}
          moduleId={mod.id}
          tasks={mod.tasks}
          completedTasks={completedTasks}
          isComplete={isComplete}
        />
      </section>

      {/* Notes */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Notes
        </h2>
        <ModuleNotes
          userId={user.id}
          moduleId={mod.id}
          initialNotes={progress?.notes ?? ""}
        />
      </section>

      {/* Quiz */}
      {mod.quiz.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Quiz
          </h2>
          <Quiz
            moduleId={mod.id}
            questions={mod.quiz}
            bestScore={bestScore}
          />
        </section>
      )}

      {/* Sign-off */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Sign-off
        </h2>
        <SignOff
          userId={user.id}
          moduleId={mod.id}
          isComplete={isComplete}
          signedOff={signedOff}
          signedOffAt={progress?.signed_off_at ?? null}
          completedTaskCount={completedTasks.size}
          totalTaskCount={mod.tasks.length}
        />
      </section>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-100">
        {prevDay ? (
          <Link
            href={`/manager/gm-training/day/${prevDay}`}
            className="text-sm text-gray-500 hover:text-nrg-green transition"
          >
            ← Day {prevDay}
          </Link>
        ) : <div />}
        {nextDay ? (
          <Link
            href={`/manager/gm-training/day/${nextDay}`}
            className="text-sm text-nrg-green font-medium hover:underline"
          >
            Day {nextDay} →
          </Link>
        ) : (
          <Link
            href="/manager/gm-training"
            className="text-sm text-nrg-gold font-medium hover:underline"
          >
            Back to overview →
          </Link>
        )}
      </div>
    </div>
  );
}
