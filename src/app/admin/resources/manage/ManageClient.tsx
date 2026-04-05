"use client";

import { useState, useTransition } from "react";
import { createDocument, updateDocument, deleteDocument } from "./actions";

interface Doc {
  id: string;
  title: string;
  content: string;
  category: string;
  category_label: string;
  applicable_states: string[];
  source: string;
}

const CATEGORIES = [
  { value: "start-here", label: "👋 START HERE!" },
  { value: "manager-responsibilities", label: "Manager Responsibilities + Procedures" },
  { value: "accounting", label: "Accounting Manual" },
  { value: "hr", label: "HR: Benefits, Manuals, Forms & Procedures" },
  { value: "hiring-staffing", label: "Hiring and Staffing (incl. Discipline)" },
  { value: "repairs-maintenance", label: "Repairs & Maintenance (R&M)" },
  { value: "marketing", label: "Marketing + Communications (MarComm)" },
  { value: "staff-training", label: "Staff Training" },
  { value: "whos-who", label: "Who's Who & What's What" },
  { value: "junebug", label: "Junebug" },
  { value: "general", label: "General" },
];

const STATE_OPTIONS = [
  { value: "dc", label: "DC" },
  { value: "va", label: "VA" },
  { value: "md", label: "MD" },
  { value: "la", label: "NOLA" },
];

function DocForm({
  doc,
  onSave,
  onCancel,
}: {
  doc?: Doc;
  onSave: (formData: FormData) => void;
  onCancel: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const defaultStates = doc?.applicable_states ?? ["dc", "va", "md", "la"];

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => onSave(formData));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1 block">Title</label>
        <input
          name="title"
          required
          defaultValue={doc?.title}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-nrg-charcoal focus:outline-none focus:ring-2 focus:ring-nrg-green/30 focus:border-nrg-green"
          placeholder="Document title"
        />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1 block">Category</label>
        <select
          name="category"
          required
          defaultValue={doc?.category ?? "general"}
          onChange={(e) => {
            const opt = CATEGORIES.find((c) => c.value === e.target.value);
            const labelInput = e.target.form?.querySelector<HTMLInputElement>('[name="category_label"]');
            if (labelInput && opt) labelInput.value = opt.label;
          }}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-nrg-charcoal focus:outline-none focus:ring-2 focus:ring-nrg-green/30 focus:border-nrg-green"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <input
          type="hidden"
          name="category_label"
          defaultValue={doc?.category_label ?? "General"}
        />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1 block">Applies to</label>
        <div className="flex gap-3">
          {STATE_OPTIONS.map((s) => (
            <label key={s.value} className="flex items-center gap-1.5 text-sm text-nrg-charcoal cursor-pointer">
              <input
                type="checkbox"
                name="applicable_states"
                value={s.value}
                defaultChecked={defaultStates.includes(s.value)}
                className="accent-nrg-green"
              />
              {s.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1 block">Content</label>
        <textarea
          name="content"
          rows={10}
          defaultValue={doc?.content}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-nrg-charcoal focus:outline-none focus:ring-2 focus:ring-nrg-green/30 focus:border-nrg-green resize-y font-mono"
          placeholder="Paste the full content of this document here. The more detail, the better the chatbot can answer questions about it."
        />
        <p className="text-xs text-gray-400 mt-1">Markdown supported. Paste full policy text, SOP steps, contact lists, etc.</p>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-nrg-green text-white font-medium text-sm rounded-xl px-5 py-2.5 hover:bg-nrg-green/90 transition disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Document"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-gray-200 text-nrg-charcoal font-medium text-sm rounded-xl px-5 py-2.5 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function AddButton() {
  const [open, setOpen] = useState(false);

  async function handleSave(formData: FormData) {
    await createDocument(formData);
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-nrg-green text-white font-medium text-sm rounded-xl px-4 py-2.5 hover:bg-nrg-green/90 transition"
      >
        + Add Document
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
          <div className="absolute inset-0 bg-black/20" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
            <h2 className="font-semibold text-nrg-charcoal text-lg mb-5">Add Document</h2>
            <DocForm onSave={handleSave} onCancel={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

export default function ManageClient({ documents }: { documents: Doc[] }) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = documents.filter(
    (d) =>
      !search ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.category_label.toLowerCase().includes(search.toLowerCase())
  );

  async function handleUpdate(id: string, formData: FormData) {
    await updateDocument(id, formData);
    setEditingId(null);
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteDocument(id);
      setDeletingId(null);
    });
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Filter documents..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-nrg-charcoal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-nrg-green/30 focus:border-nrg-green"
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Title</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400 hidden md:table-cell">Category</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400 hidden md:table-cell">Content</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50 transition">
                <td className="px-5 py-3">
                  <p className="font-medium text-nrg-charcoal">{doc.title}</p>
                  {doc.applicable_states?.length < 4 && (
                    <div className="flex gap-1 mt-0.5">
                      {doc.applicable_states.map((s) => (
                        <span key={s} className="text-xs bg-nrg-green/10 text-nrg-green rounded-full px-1.5">
                          {s.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{doc.category_label}</td>
                <td className="px-5 py-3 hidden md:table-cell">
                  {doc.content ? (
                    <span className="text-xs text-gray-400 truncate block max-w-xs">
                      {doc.content.slice(0, 80)}...
                    </span>
                  ) : (
                    <span className="text-xs text-orange-400 font-medium">No content</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(doc.id)}
                      className="text-xs text-nrg-green font-medium hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletingId(doc.id)}
                      className="text-xs text-red-400 font-medium hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      {editingId && (() => {
        const doc = documents.find((d) => d.id === editingId)!;
        return (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
            <div className="absolute inset-0 bg-black/20" onClick={() => setEditingId(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
              <h2 className="font-semibold text-nrg-charcoal text-lg mb-5">Edit Document</h2>
              <DocForm
                doc={doc}
                onSave={(fd) => handleUpdate(doc.id, fd)}
                onCancel={() => setEditingId(null)}
              />
            </div>
          </div>
        );
      })()}

      {/* Delete confirm */}
      {deletingId && (() => {
        const doc = documents.find((d) => d.id === deletingId)!;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/20" onClick={() => setDeletingId(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
              <h2 className="font-semibold text-nrg-charcoal mb-2">Delete document?</h2>
              <p className="text-sm text-gray-500 mb-5">
                &ldquo;{doc.title}&rdquo; will be permanently removed from the knowledge base.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(doc.id)}
                  disabled={isPending}
                  className="bg-red-500 text-white font-medium text-sm rounded-xl px-4 py-2.5 hover:bg-red-600 transition disabled:opacity-50"
                >
                  {isPending ? "Deleting..." : "Yes, delete"}
                </button>
                <button
                  onClick={() => setDeletingId(null)}
                  className="border border-gray-200 text-nrg-charcoal font-medium text-sm rounded-xl px-4 py-2.5 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export { AddButton };
