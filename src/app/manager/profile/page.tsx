import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getModulesFromDB } from "@/lib/modules/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Profile | NRG Training" };

const MODULE_ICONS = ["📋", "🤝", "🍽️", "💬", "📊", "👥", "🛠️", "📣", "🌟", "🏆"];

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const admin = createAdminClient();
  const modules = await getModulesFromDB();

  const { data: progressRows } = await supabase
    .from("module_progress")
    .select("module_id, completed_at, signed_off_at")
    .eq("user_id", user.id);

  const { data: quizRows } = await supabase
    .from("quiz_attempts")
    .select("module_id, score")
    .eq("user_id", user.id);

  // Best quiz score per module
  const quizScoreMap = new Map<string, number>();
  for (const q of quizRows ?? []) {
    const prev = quizScoreMap.get(q.module_id) ?? -1;
    if (q.score > prev) quizScoreMap.set(q.module_id, q.score);
  }

  const progressMap = new Map(
    (progressRows ?? []).map((p) => [p.module_id, p])
  );

  const completedModules = modules.filter((m) => !!progressMap.get(m.id)?.completed_at);
  const signedOffModules = modules.filter((m) => !!progressMap.get(m.id)?.signed_off_at);
  const fullyTrained = completedModules.length === modules.length;

  const name = user.user_metadata?.full_name ?? user.email ?? "GM";
  const role = user.user_metadata?.role ?? "manager";

  const roleLabel: Record<string, string> = {
    manager: "General Manager",
    do: "Director of Operations",
    corporate: "Corporate",
    trainee: "Trainee",
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-nrg-green flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-nrg-charcoal">{name}</h1>
          <p className="text-sm text-gray-500">{roleLabel[role] ?? role}</p>
        </div>
        {fullyTrained && (
          <span className="text-xs bg-nrg-gold/15 text-nrg-gold font-semibold rounded-full px-3 py-1.5">
            Fully Trained
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-nrg-green">
            {completedModules.length}
            <span className="text-gray-300 text-base">/{modules.length}</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Modules complete</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-nrg-gold">
            {signedOffModules.length}
            <span className="text-gray-300 text-base">/{modules.length}</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Signed off</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-nrg-charcoal">
            {Math.round((completedModules.length / Math.max(modules.length, 1)) * 100)}
            <span className="text-gray-300 text-base">%</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Complete</p>
        </div>
      </div>

      {/* Fully trained banner */}
      {fullyTrained && (
        <div className="bg-nrg-gold/10 border border-nrg-gold/30 rounded-2xl p-5 mb-6 text-center">
          <p className="text-2xl mb-1">🏆</p>
          <p className="font-bold text-nrg-charcoal">GM Training Complete</p>
          <p className="text-sm text-gray-500 mt-0.5">
            You've completed all {modules.length} modules of the NRG GM Training Program.
          </p>
        </div>
      )}

      {/* Badge grid */}
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
        Earned Badges
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {modules.map((mod, i) => {
          const prog = progressMap.get(mod.id);
          const earned = !!prog?.completed_at;
          const signed = !!prog?.signed_off_at;
          const quizScore = quizScoreMap.get(mod.id) ?? null;
          const completedDate = prog?.completed_at
            ? new Date(prog.completed_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            : null;

          return (
            <div
              key={mod.id}
              className={`rounded-2xl border p-4 transition ${
                earned
                  ? "bg-nrg-green border-nrg-green text-white shadow-sm"
                  : "bg-white border-gray-100 text-gray-300 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`text-2xl ${earned ? "" : "grayscale opacity-40"}`}>
                  {MODULE_ICONS[i] ?? "📌"}
                </span>
                {signed && (
                  <span className="text-xs bg-nrg-gold/20 text-nrg-gold rounded-full px-1.5 py-0.5 font-medium">
                    ✓ Signed
                  </span>
                )}
              </div>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${earned ? "text-nrg-gold" : "text-gray-300"}`}>
                Day {mod.day}
              </p>
              <p className={`text-sm font-medium leading-tight ${earned ? "text-white" : "text-gray-400"}`}>
                {mod.title}
              </p>
              {earned && completedDate && (
                <p className="text-xs text-white/60 mt-2">{completedDate}</p>
              )}
              {earned && quizScore !== null && (
                <p className="text-xs text-white/60">{quizScore}% quiz</p>
              )}
              {!earned && (
                <p className="text-xs text-gray-300 mt-2">Not yet earned</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
