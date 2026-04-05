"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  userId: string;
  moduleId: string;
  isComplete: boolean;
  signedOff: boolean;
  signedOffAt: string | null;
  completedTaskCount: number;
  totalTaskCount: number;
}

export default function SignOff({
  userId,
  moduleId,
  isComplete,
  signedOff,
  signedOffAt,
  completedTaskCount,
  totalTaskCount,
}: Props) {
  const [complete, setComplete] = useState(isComplete);
  const [signed, setSigned] = useState(signedOff);
  const [signedAt, setSignedAt] = useState(signedOffAt);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  async function markComplete() {
    startTransition(async () => {
      const now = new Date().toISOString();
      await supabase.from("module_progress").upsert(
        { user_id: userId, module_id: moduleId, completed_at: now, updated_at: now },
        { onConflict: "user_id,module_id" }
      );
      setComplete(true);
    });
  }

  async function handleSignOff() {
    startTransition(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const now = new Date().toISOString();
      await supabase.from("module_progress").upsert(
        {
          user_id: userId,
          module_id: moduleId,
          signed_off_by: user.id,
          signed_off_at: now,
          updated_at: now,
        },
        { onConflict: "user_id,module_id" }
      );
      setSigned(true);
      setSignedAt(now);
    });
  }

  const allTasksDone = completedTaskCount === totalTaskCount;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      {/* Mark complete */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-nrg-charcoal">Mark day complete</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {allTasksDone
              ? "All tasks finished — ready to complete this day."
              : `${completedTaskCount} of ${totalTaskCount} tasks done`}
          </p>
        </div>
        {complete ? (
          <span className="text-xs bg-green-100 text-green-700 rounded-full px-3 py-1.5 font-medium">
            ✓ Completed
          </span>
        ) : (
          <button
            onClick={markComplete}
            disabled={isPending}
            className="text-sm bg-nrg-green text-white rounded-lg px-4 py-2 font-medium hover:bg-opacity-90 disabled:opacity-50 transition"
          >
            Complete day
          </button>
        )}
      </div>

      <div className="border-t border-gray-50" />

      {/* DO sign-off */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-nrg-charcoal">Director of Operations sign-off</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {signed && signedAt
              ? `Signed off ${new Date(signedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
              : "Pending DO review"}
          </p>
        </div>
        {signed ? (
          <span className="text-xs bg-nrg-gold/15 text-nrg-gold rounded-full px-3 py-1.5 font-medium">
            ✓ Signed off
          </span>
        ) : (
          <button
            onClick={handleSignOff}
            disabled={isPending || !complete}
            title={!complete ? "Mark day complete first" : ""}
            className="text-sm border border-nrg-gold text-nrg-gold rounded-lg px-4 py-2 font-medium hover:bg-nrg-gold hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Sign off
          </button>
        )}
      </div>
    </div>
  );
}
