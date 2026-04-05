"use client";

import { useState } from "react";

interface Doc {
  id: string;
  title: string;
  content: string;
  category: string;
  category_label: string;
  applicable_states: string[];
  file_url?: string | null;
}

interface Group {
  category: string;
  label: string;
  docs: Doc[];
}

interface Props {
  groups: Group[];
}

const STATE_LABELS: Record<string, string> = {
  dc: "DC",
  va: "VA",
  md: "MD",
  la: "NOLA",
};

const ALL_STATES = ["dc", "va", "md", "la"];

export default function ResourcesClient({ groups }: Props) {
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [openDoc, setOpenDoc] = useState<Doc | null>(null);

  const query = search.toLowerCase().trim();

  const filtered = groups
    .map((g) => ({
      ...g,
      docs: g.docs.filter((d) => {
        const matchesSearch =
          !query ||
          d.title.toLowerCase().includes(query) ||
          d.content.toLowerCase().includes(query);
        const matchesState =
          selectedState === "all" ||
          d.applicable_states?.includes(selectedState);
        return matchesSearch && matchesState;
      }),
    }))
    .filter((g) => g.docs.length > 0);

  const totalResults = filtered.reduce((sum, g) => sum + g.docs.length, 0);

  return (
    <div>
      {/* Search + filter bar */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2 text-sm text-nrg-charcoal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-nrg-green/30 focus:border-nrg-green"
        />
        <div className="flex gap-1.5">
          <button
            onClick={() => setSelectedState("all")}
            className={`text-xs font-medium px-3 py-2 rounded-xl transition ${
              selectedState === "all"
                ? "bg-nrg-charcoal text-white"
                : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            All states
          </button>
          {ALL_STATES.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedState(s === selectedState ? "all" : s)}
              className={`text-xs font-medium px-3 py-2 rounded-xl transition ${
                selectedState === s
                  ? "bg-nrg-green text-white"
                  : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {STATE_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {query && (
        <p className="text-xs text-gray-400 mb-4">
          {totalResults} result{totalResults !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
        </p>
      )}

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-400">
          <p className="font-medium text-gray-500">No results found</p>
          <p className="text-sm mt-1">Try a different search or state filter.</p>
        </div>
      )}

      <div className="space-y-6">
        {filtered.map((g) => (
          <div key={g.category}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              {g.label}
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {g.docs.map((doc, i) => (
                <button
                  key={doc.id}
                  onClick={() => setOpenDoc(doc)}
                  className={`w-full text-left px-5 py-3.5 flex items-start justify-between gap-3 hover:bg-gray-50 transition ${
                    i < g.docs.length - 1 ? "border-b border-gray-50" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-nrg-charcoal">{doc.title}</p>
                    {doc.content && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {doc.content.replace(/[#*_\[\]]/g, "").slice(0, 100)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                    {doc.applicable_states?.length < 4 &&
                      doc.applicable_states.map((s) => (
                        <span
                          key={s}
                          className="text-xs bg-gray-100 text-gray-400 rounded-full px-1.5 py-0.5"
                        >
                          {STATE_LABELS[s] ?? s}
                        </span>
                      ))}
                    <span className="text-xs text-nrg-gold">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Document drawer */}
      {openDoc && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="flex-1 bg-black/20"
            onClick={() => setOpenDoc(null)}
          />
          <div className="w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-nrg-charcoal">{openDoc.title}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{openDoc.category_label}</p>
              </div>
              <button
                onClick={() => setOpenDoc(null)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none mt-0.5"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {openDoc.file_url && (
                <a
                  href={openDoc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-nrg-green/10 text-nrg-green font-medium text-sm rounded-xl px-4 py-2.5 hover:bg-nrg-green/20 transition mb-4"
                >
                  View PDF
                </a>
              )}
              {openDoc.content ? (
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                  {openDoc.content}
                </div>
              ) : !openDoc.file_url ? (
                <p className="text-sm text-gray-400 italic">
                  This resource references an attached document. Check the NRG Playbook on Trello for the full content.
                </p>
              ) : null}
            </div>
            {openDoc.applicable_states?.length < 4 && (
              <div className="px-6 py-3 border-t border-gray-100 flex gap-1.5">
                <span className="text-xs text-gray-400">Applies to:</span>
                {openDoc.applicable_states.map((s) => (
                  <span key={s} className="text-xs bg-nrg-green/10 text-nrg-green rounded-full px-2 py-0.5 font-medium">
                    {STATE_LABELS[s] ?? s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
