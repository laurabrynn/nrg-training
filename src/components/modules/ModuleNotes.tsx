"use client";

import { useState, useRef, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  userId: string;
  moduleId: string;
  initialNotes: string;
}

export default function ModuleNotes({ userId, moduleId, initialNotes }: Props) {
  const [notes, setNotes] = useState(initialNotes);
  const [saved, setSaved] = useState(true);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabase = createClient();

  function handleChange(value: string) {
    setNotes(value);
    setSaved(false);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        await supabase
          .from("module_progress")
          .upsert(
            { user_id: userId, module_id: moduleId, notes: value, updated_at: new Date().toISOString() },
            { onConflict: "user_id,module_id" }
          );
        setSaved(true);
      });
    }, 800);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <textarea
        value={notes}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Add notes, questions, or observations for this day…"
        rows={5}
        className="w-full px-6 py-4 text-sm text-gray-700 placeholder-gray-300 resize-none focus:outline-none leading-relaxed"
      />
      <div className="px-6 py-2 border-t border-gray-50 flex justify-end">
        <span className={`text-xs transition ${isPending || !saved ? "text-gray-400" : "text-green-500"}`}>
          {isPending ? "Saving…" : saved ? "Saved" : "Unsaved"}
        </span>
      </div>
    </div>
  );
}
