import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import ModuleEditor from "./ModuleEditor";

export const dynamic = "force-dynamic";

export default async function AdminModuleEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();

  const [{ data: mod }, { data: tasks }, { data: questions }] = await Promise.all([
    admin.from("gm_modules").select("*").eq("id", id).single(),
    admin.from("gm_module_tasks").select("*").eq("module_id", id).order("sort_order"),
    admin.from("gm_quiz_questions").select("*").eq("module_id", id).order("sort_order"),
  ]);

  if (!mod) notFound();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/admin/modules" className="hover:text-nrg-green transition">
          Training Modules
        </Link>
        <span>/</span>
        <span className="text-nrg-charcoal font-medium">Day {mod.day}: {mod.title}</span>
      </div>

      <ModuleEditor mod={mod} tasks={tasks ?? []} questions={questions ?? []} />
    </div>
  );
}
