import Link from "next/link";
import { getModulesFromDB } from "@/lib/modules/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Training Modules | NRG Training" };

export default async function AdminModulesPage() {
  const modules = await getModulesFromDB();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-nrg-charcoal">Training Modules</h1>
        <p className="text-gray-500 text-sm mt-1">
          Edit GM training day content, tasks, and quiz questions.
        </p>
      </div>

      <div className="space-y-2">
        {modules.map((mod) => (
          <Link
            key={mod.id}
            href={`/admin/modules/${mod.id}`}
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
              <span>{mod.tasks.length} tasks</span>
              <span>{mod.quiz.length} questions</span>
            </div>
            <span className="text-xs text-nrg-gold flex-shrink-0">Edit →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
