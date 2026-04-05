"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ModuleTask } from "@/lib/modules/gm-training";

interface Props {
  userId: string;
  moduleId: string;
  tasks: ModuleTask[];
  completedTasks: Set<number>;
  isComplete: boolean;
}

export default function TaskChecklist({ userId, moduleId, tasks, completedTasks, isComplete }: Props) {
  const [checked, setChecked] = useState<Set<number>>(completedTasks);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  async function toggle(index: number) {
    const nowChecked = checked.has(index);
    const next = new Set(checked);
    if (nowChecked) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setChecked(next);

    startTransition(async () => {
      if (nowChecked) {
        await supabase
          .from("module_task_completions")
          .delete()
          .eq("user_id", userId)
          .eq("module_id", moduleId)
          .eq("task_index", index);
      } else {
        await supabase
          .from("module_task_completions")
          .upsert({ user_id: userId, module_id: moduleId, task_index: index });
      }
    });
  }

  const completedCount = checked.size;
  const totalCount = tasks.length;
  const pct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Progress bar */}
      <div className="px-6 pt-4 pb-3 border-b border-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">{completedCount} of {totalCount} tasks</span>
          <span className="text-xs font-medium text-nrg-green">{pct}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-nrg-green rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <ul className="divide-y divide-gray-50">
        {tasks.map((task, i) => (
          <li key={i}>
            <button
              onClick={() => toggle(i)}
              disabled={isPending}
              className="w-full flex items-start gap-4 px-6 py-3.5 text-left hover:bg-gray-50 transition"
            >
              <span
                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                  checked.has(i)
                    ? "bg-nrg-green border-nrg-green"
                    : "border-gray-300"
                }`}
              >
                {checked.has(i) && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className={`flex-1 text-sm leading-relaxed ${checked.has(i) ? "line-through text-gray-400" : "text-gray-700"}`}>
                {task.text}
                {task.duration && (
                  <span className="ml-2 text-xs text-gray-400 no-underline">({task.duration})</span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
