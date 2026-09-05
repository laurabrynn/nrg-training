"use client";

import { useState, useTransition } from "react";
import { createConceptModule } from "./actions";

const ROLES = [
  { value: "gm", label: "General Manager" },
  { value: "chef", label: "Chef / Kitchen Manager" },
  { value: "server", label: "Server" },
  { value: "runner", label: "Food Runner" },
  { value: "busser", label: "Busser" },
  { value: "host", label: "Host" },
  { value: "kitchen", label: "Kitchen Staff (BOH)" },
];

export default function AddModuleButton({ conceptId, conceptSlug }: { conceptId: string; conceptSlug: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-nrg-green text-white text-sm font-medium rounded-xl px-4 py-2 hover:opacity-90 transition"
      >
        + Add Module
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="font-semibold text-nrg-charcoal text-lg mb-4">Add Training Module</h2>
            <form
              action={(fd) => startTransition(() => createConceptModule(conceptId, conceptSlug, fd))}
              className="space-y-3"
            >
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Role</label>
                <select name="staff_role" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required>
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Training Day</label>
                <input
                  type="number"
                  name="day"
                  min="1"
                  defaultValue="1"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Title</label>
                <input
                  name="title"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  placeholder="e.g. Welcome & Orientation"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Focus / Description</label>
                <textarea
                  name="focus"
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
                  placeholder="One-line summary of what this module covers"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-nrg-green text-white text-sm rounded-xl px-4 py-2 hover:opacity-90 disabled:opacity-50 font-medium"
                >
                  {isPending ? "Creating…" : "Create & Edit"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-sm text-gray-400 hover:text-gray-600 px-3"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
