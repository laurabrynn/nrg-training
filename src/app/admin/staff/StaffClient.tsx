"use client";

import { useState, useTransition } from "react";
import { inviteUser, updateUserRole, updateUserConcept } from "./actions";

interface Concept {
  id: string;
  name: string;
  state: string;
}

interface StaffUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  concept_id: string | null;
  modules_complete: number;
}

const ROLES = [
  { value: "manager", label: "General Manager" },
  { value: "do", label: "Director of Operations" },
  { value: "corporate", label: "Corporate" },
  { value: "trainee", label: "Trainee" },
];

const ROLE_BADGE: Record<string, string> = {
  manager: "bg-nrg-green/10 text-nrg-green",
  do: "bg-nrg-gold/15 text-nrg-gold",
  corporate: "bg-nrg-charcoal/10 text-nrg-charcoal",
  trainee: "bg-gray-100 text-gray-500",
};

const STATE_LABELS: Record<string, string> = {
  dc: "DC", va: "VA", md: "MD", la: "NOLA",
};

function InviteModal({ concepts, onClose }: { concepts: Concept[]; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const byState = concepts.reduce<Record<string, Concept[]>>((acc, c) => {
    const s = c.state ?? "other";
    if (!acc[s]) acc[s] = [];
    acc[s].push(c);
    return acc;
  }, {});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await inviteUser(formData);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to invite user");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="font-semibold text-nrg-charcoal text-lg mb-5">Invite User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1 block">Full Name</label>
            <input
              name="full_name"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-nrg-green/30 focus:border-nrg-green"
              placeholder="Jane Smith"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1 block">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-nrg-green/30 focus:border-nrg-green"
              placeholder="jane@nrg.com"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1 block">Role</label>
            <select
              name="role"
              required
              defaultValue="manager"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-nrg-green/30 focus:border-nrg-green"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1 block">Restaurant / Concept</label>
            <select
              name="concept_id"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-nrg-green/30 focus:border-nrg-green"
            >
              <option value="">— Unassigned —</option>
              {Object.entries(byState).map(([state, cs]) => (
                <optgroup key={state} label={STATE_LABELS[state] ?? state.toUpperCase()}>
                  {cs.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={isPending}
              className="bg-nrg-green text-white font-medium text-sm rounded-xl px-5 py-2.5 hover:bg-nrg-green/90 transition disabled:opacity-50"
            >
              {isPending ? "Sending invite..." : "Send Invite"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-200 text-nrg-charcoal font-medium text-sm rounded-xl px-5 py-2.5 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RoleSelect({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [value, setValue] = useState(currentRole);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleChange(role: string) {
    setValue(role);
    setSaved(false);
    startTransition(async () => {
      await updateUserRole(userId, role);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
        className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-nrg-green/30 disabled:opacity-50 cursor-pointer ${ROLE_BADGE[value] ?? "bg-gray-100 text-gray-500"}`}
      >
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>
      {saved && <span className="text-xs text-nrg-green">✓</span>}
    </div>
  );
}

function ConceptSelect({ userId, currentConceptId, concepts }: { userId: string; currentConceptId: string | null; concepts: Concept[] }) {
  const [value, setValue] = useState(currentConceptId ?? "");
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const byState = concepts.reduce<Record<string, Concept[]>>((acc, c) => {
    const s = c.state ?? "other";
    if (!acc[s]) acc[s] = [];
    acc[s].push(c);
    return acc;
  }, {});

  function handleChange(conceptId: string) {
    setValue(conceptId);
    setSaved(false);
    startTransition(async () => {
      await updateUserConcept(userId, conceptId || null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
        className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-nrg-green/30 bg-white text-gray-700 disabled:opacity-50 max-w-[180px]"
      >
        <option value="">— Unassigned —</option>
        {Object.entries(byState).map(([state, cs]) => (
          <optgroup key={state} label={STATE_LABELS[state] ?? state.toUpperCase()}>
            {cs.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </optgroup>
        ))}
      </select>
      {saved && <span className="text-xs text-nrg-green">✓</span>}
    </div>
  );
}

export default function StaffClient({
  users,
  concepts,
  totalModules,
}: {
  users: StaffUser[];
  concepts: Concept[];
  totalModules: number;
}) {
  const [showInvite, setShowInvite] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      !search ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <input
          type="text"
          placeholder="Filter by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-nrg-green/30 focus:border-nrg-green"
        />
        <button
          onClick={() => setShowInvite(true)}
          className="bg-nrg-green text-white font-medium text-sm rounded-xl px-4 py-2.5 hover:bg-nrg-green/90 transition whitespace-nowrap"
        >
          + Invite User
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Name / Email</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Role</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400 hidden md:table-cell">Restaurant</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400 hidden sm:table-cell">Training</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                  {search ? "No users match your search." : "No users yet — invite someone above."}
                </td>
              </tr>
            )}
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                <td className="px-5 py-4">
                  <p className="font-medium text-nrg-charcoal">{u.full_name || "—"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{u.email}</p>
                </td>
                <td className="px-5 py-4">
                  <RoleSelect userId={u.id} currentRole={u.role} />
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <ConceptSelect userId={u.id} currentConceptId={u.concept_id} concepts={concepts} />
                </td>
                <td className="px-5 py-4 hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-nrg-green rounded-full"
                        style={{ width: `${totalModules > 0 ? Math.round((u.modules_complete / totalModules) * 100) : 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {u.modules_complete}/{totalModules}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showInvite && <InviteModal concepts={concepts} onClose={() => setShowInvite(false)} />}
    </div>
  );
}
