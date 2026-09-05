import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getConceptModuleForRole } from "@/lib/modules/concept-db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Property Training | NRG Training" };

export default async function PropertyTrainingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const conceptId = user.user_metadata?.concept_id;
  if (!conceptId) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-nrg-charcoal mb-2">Property Training</h1>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-400">
          <p className="font-medium text-gray-500">No restaurant assigned</p>
          <p className="text-sm mt-1">Ask your administrator to assign you to a restaurant to access property training.</p>
        </div>
      </div>
    );
  }

  const admin = createAdminClient();
  const { data: concept } = await admin.from("concepts").select("id, name, slug").eq("id", conceptId).single();
  if (!concept) redirect("/manager");

  const modules = await getConceptModuleForRole(conceptId, "gm");

  const { data: progressRows } = await supabase
    .from("concept_module_progress")
    .select("module_id, completed_at")
    .eq("user_id", user.id);

  const completedIds = new Set((progressRows ?? []).filter((p) => p.completed_at).map((p) => p.module_id));
  const completedCount = completedIds.size;
  const totalCount = modules.length;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-nrg-charcoal">{concept.name}</h1>
        <p className="text-gray-500 text-sm mt-1">Property training track · {completedCount} of {totalCount} modules complete</p>
        {totalCount > 0 && (
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-nrg-green rounded-full transition-all"
              style={{ width: `${Math.round((completedCount / totalCount) * 100)}%` }}
            />
          </div>
        )}
      </div>

      {modules.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-400">
          <p className="font-medium text-gray-500">No modules yet</p>
          <p className="text-sm mt-1">Property-specific training for {concept.name} is coming soon.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {modules.map((mod) => {
            const done = completedIds.has(mod.id);
            return (
              <Link
                key={mod.id}
                href={`/manager/property-training/${mod.day}?concept=${conceptId}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition group"
              >
                <span className={`flex-shrink-0 w-10 h-10 rounded-full text-sm font-bold flex items-center justify-center ${done ? "bg-nrg-green text-white" : "bg-gray-100 text-gray-500"}`}>
                  {done ? "✓" : mod.day}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-nrg-charcoal">{mod.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{mod.focus}</p>
                </div>
                <div className="flex gap-2 text-xs text-gray-400 flex-shrink-0">
                  <span>{mod.tasks.length} tasks</span>
                </div>
                <span className="text-xs text-nrg-gold flex-shrink-0">Start →</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
