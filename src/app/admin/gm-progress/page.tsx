import { createClient, createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { gmModules } from "@/lib/modules/gm-training";

export const metadata = { title: "GM Progress | NRG Training" };

export default async function GMProgressPage() {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const { data: users } = await adminClient.auth.admin.listUsers();
  const gms = (users?.users ?? []).filter((u) => u.user_metadata?.role === "manager");

  const { data: allProgress } = await supabase
    .from("module_progress")
    .select("user_id, module_id, completed_at, signed_off_at, notes");

  const { data: allTasks } = await supabase
    .from("module_task_completions")
    .select("user_id, module_id");

  const { data: assignments } = await supabase
    .from("user_properties")
    .select("user_id, property:property_id(name, state)");

  const progressByUser = new Map<string, typeof allProgress>();
  for (const p of allProgress ?? []) {
    if (!progressByUser.has(p.user_id)) progressByUser.set(p.user_id, []);
    progressByUser.get(p.user_id)!.push(p);
  }

  const tasksByUser = new Map<string, number>();
  for (const t of allTasks ?? []) {
    tasksByUser.set(t.user_id, (tasksByUser.get(t.user_id) ?? 0) + 1);
  }

  const propertyByUser = new Map<string, { name: string; state: string }>();
  for (const a of assignments ?? []) {
    if (a.property) propertyByUser.set(a.user_id, a.property as { name: string; state: string });
  }

  const stateLabel: Record<string, string> = { dc: "DC", va: "VA", md: "MD", la: "NOLA" };
  const totalDays = gmModules.length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-nrg-charcoal">GM Progress</h1>
        <p className="text-gray-500 text-sm mt-1">
          Training status across all general managers.
        </p>
      </div>

      {gms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-400">
          <p className="font-medium text-gray-500">No GMs yet</p>
          <p className="text-sm mt-1">Add manager accounts in <Link href="/admin/staff" className="text-nrg-green underline">Staff Management</Link>.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {gms.map((gm) => {
            const progress = progressByUser.get(gm.id) ?? [];
            const completedDays = progress.filter((p) => p.completed_at).length;
            const signedOffDays = progress.filter((p) => p.signed_off_at).length;
            const pct = Math.round((completedDays / totalDays) * 100);
            const property = propertyByUser.get(gm.id);
            const hasNotes = progress.some((p) => p.notes?.trim());

            return (
              <div key={gm.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-nrg-charcoal">
                        {gm.user_metadata?.full_name ?? gm.email}
                      </h2>
                      {property && (
                        <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
                          {stateLabel[property.state] ?? property.state} · {property.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{gm.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-nrg-charcoal">{pct}%</p>
                    <p className="text-xs text-gray-400">{completedDays}/{totalDays} days</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-nrg-green rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Day grid */}
                <div className="flex gap-1.5 flex-wrap mb-4">
                  {gmModules.map((mod) => {
                    const dayProgress = progress.find((p) => p.module_id === mod.id);
                    const isComplete = !!dayProgress?.completed_at;
                    const isSigned = !!dayProgress?.signed_off_at;
                    return (
                      <div
                        key={mod.id}
                        title={`Day ${mod.day}: ${mod.title}${isComplete ? " ✓" : ""}${isSigned ? " (signed off)" : ""}`}
                        className={`w-7 h-7 rounded-md text-xs font-bold flex items-center justify-center ${
                          isSigned
                            ? "bg-nrg-gold text-white"
                            : isComplete
                            ? "bg-nrg-green text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {mod.day}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-3 text-xs text-gray-400">
                    <span><span className="inline-block w-2.5 h-2.5 rounded-sm bg-nrg-green mr-1" />Complete</span>
                    <span><span className="inline-block w-2.5 h-2.5 rounded-sm bg-nrg-gold mr-1" />Signed off</span>
                    {signedOffDays < completedDays && (
                      <span className="text-nrg-gold font-medium">
                        {completedDays - signedOffDays} day{completedDays - signedOffDays !== 1 ? "s" : ""} awaiting sign-off
                      </span>
                    )}
                  </div>
                  {hasNotes && (
                    <span className="text-xs text-gray-400">📝 Has notes</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
