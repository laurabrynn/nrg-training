import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import { getConceptModuleById } from "@/lib/modules/concept-db";
import ConceptModuleEditor from "./ConceptModuleEditor";

export const dynamic = "force-dynamic";

const ROLE_LABELS: Record<string, string> = {
  gm: "General Manager", chef: "Chef / Kitchen Manager", server: "Server",
  runner: "Food Runner", busser: "Busser", host: "Host", kitchen: "Kitchen Staff (BOH)",
};

export default async function ConceptModuleEditPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const admin = createAdminClient();

  const [mod, { data: concept }] = await Promise.all([
    getConceptModuleById(id),
    admin.from("concepts").select("name").eq("slug", slug).single(),
  ]);

  if (!mod || !concept) notFound();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 flex-wrap">
        <Link href="/admin/concepts" className="hover:text-nrg-green transition">Concepts</Link>
        <span>/</span>
        <Link href={`/admin/concepts/${slug}`} className="hover:text-nrg-green transition">{concept.name}</Link>
        <span>/</span>
        <span className="text-nrg-charcoal font-medium">
          {ROLE_LABELS[mod.staff_role] ?? mod.staff_role} — Day {mod.day}
        </span>
      </div>

      <ConceptModuleEditor mod={mod} slug={slug} />
    </div>
  );
}
