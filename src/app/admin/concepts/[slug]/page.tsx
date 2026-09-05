import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import { getConceptModulesFull } from "@/lib/modules/concept-db";
import AddModuleButton from "./AddModuleButton";

export const dynamic = "force-dynamic";

const ROLE_LABELS: Record<string, string> = {
  gm: "General Manager",
  chef: "Chef / Kitchen Manager",
  server: "Server",
  runner: "Food Runner",
  busser: "Busser",
  host: "Host",
  kitchen: "Kitchen Staff (BOH)",
};

const ROLE_ORDER = ["gm", "chef", "server", "runner", "busser", "host", "kitchen"];

const STATE_LABELS: Record<string, string> = { dc: "DC", va: "VA", md: "MD", la: "NOLA" };

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const admin = createAdminClient();
  const { data: concept } = await admin.from("concepts").select("name").eq("slug", slug).single();
  return { title: concept ? `${concept.name} Training | NRG Training` : "Concept" };
}

export default async function ConceptDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const admin = createAdminClient();

  const { data: concept } = await admin.from("concepts").select("*").eq("slug", slug).single();
  if (!concept) notFound();

  const modules = await getConceptModulesFull(concept.id);

  const byRole = new Map<string, typeof modules>();
  for (const mod of modules) {
    if (!byRole.has(mod.staff_role)) byRole.set(mod.staff_role, []);
    byRole.get(mod.staff_role)!.push(mod);
  }

  const activeRoles = ROLE_ORDER.filter((r) => byRole.has(r));
  const emptyRoles = ROLE_ORDER.filter((r) => !byRole.has(r));

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/admin/concepts" className="hover:text-nrg-green transition">Concepts</Link>
        <span>/</span>
        <span className="text-nrg-charcoal font-medium">{concept.name}</span>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-nrg-charcoal">{concept.name}</h1>
          <p className="text-gray-400 text-sm mt-1">{STATE_LABELS[concept.state] ?? concept.state} · {modules.length} modules total</p>
        </div>
        <AddModuleButton conceptId={concept.id} conceptSlug={slug} />
      </div>

      {modules.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-400 mb-6">
          <p className="font-medium text-gray-500">No modules yet</p>
          <p className="text-sm mt-1">Click "Add Module" to create the first training module for this restaurant.</p>
        </div>
      )}

      <div className="space-y-8">
        {activeRoles.map((role) => (
          <div key={role}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              {ROLE_LABELS[role] ?? role}
            </h2>
            <div className="space-y-2">
              {byRole.get(role)!.map((mod) => (
                <Link
                  key={mod.id}
                  href={`/admin/concepts/${slug}/modules/${mod.id}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition group"
                >
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-nrg-green text-white text-sm font-bold flex items-center justify-center">
                    {mod.day}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-nrg-charcoal">{mod.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{mod.focus}</p>
                  </div>
                  <div className="flex gap-3 text-xs text-gray-400 flex-shrink-0">
                    {mod.video_url && <span>📹</span>}
                    {mod.pdf_url && <span>📄</span>}
                    <span>{mod.tasks.length} tasks</span>
                    <span>{mod.quiz.length} Qs</span>
                  </div>
                  <span className="text-xs text-nrg-gold flex-shrink-0">Edit →</span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {emptyRoles.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Roles with no modules yet
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {emptyRoles.map((role, i) => (
                <div key={role} className={`flex items-center justify-between px-5 py-3 ${i < emptyRoles.length - 1 ? "border-b border-gray-50" : ""}`}>
                  <span className="text-sm text-gray-500">{ROLE_LABELS[role] ?? role}</span>
                  <span className="text-xs text-gray-300">No modules</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
