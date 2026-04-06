import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Concepts | NRG Training" };

export default async function ConceptsPage() {
  const admin = createAdminClient();

  const { data: concepts } = await admin
    .from("concepts")
    .select("*")
    .order("state")
    .order("name");

  const byState = new Map<string, typeof concepts>();
  for (const c of concepts ?? []) {
    const s = c.state ?? "other";
    if (!byState.has(s)) byState.set(s, []);
    byState.get(s)!.push(c);
  }

  const stateLabels: Record<string, string> = {
    dc: "Washington, DC",
    va: "Virginia",
    md: "Maryland",
    la: "New Orleans",
    other: "Other",
  };

  const stateOrder = ["dc", "va", "md", "la", "other"];
  const sorted = stateOrder.filter((s) => byState.has(s));
  for (const s of byState.keys()) {
    if (!stateOrder.includes(s)) sorted.push(s);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-nrg-charcoal">Concepts</h1>
        <p className="text-gray-500 text-sm mt-1">
          {concepts?.length ?? 0} NRG restaurant concepts. Used to scope training modules and staff assignments in V2.
        </p>
      </div>

      {(!concepts || concepts.length === 0) && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-400">
          <p className="font-medium text-gray-500">No concepts yet</p>
          <p className="text-sm mt-1">Run the concepts SQL seed in Supabase to populate this list.</p>
        </div>
      )}

      <div className="space-y-6">
        {sorted.map((state) => (
          <div key={state}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              {stateLabels[state] ?? state}
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {byState.get(state)!.map((concept, i, arr) => (
                <div
                  key={concept.id}
                  className={`flex items-center justify-between px-5 py-3.5 ${
                    i < arr.length - 1 ? "border-b border-gray-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${concept.active ? "bg-nrg-green" : "bg-gray-200"}`} />
                    <span className="text-sm font-medium text-nrg-charcoal">{concept.name}</span>
                    {concept.slug && (
                      <span className="text-xs text-gray-400 font-mono">{concept.slug}</span>
                    )}
                  </div>
                  {!concept.active && (
                    <span className="text-xs text-gray-400 bg-gray-50 rounded-full px-2 py-0.5">Inactive</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-700">
        <p className="font-medium mb-1">Coming in V2</p>
        <p className="text-blue-600">Concepts will be used to scope training modules (universal vs. concept-specific) and assign staff to their home restaurant. For now this is a reference list.</p>
      </div>
    </div>
  );
}
