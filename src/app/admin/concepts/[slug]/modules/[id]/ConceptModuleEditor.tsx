"use client";

import { useState, useTransition } from "react";
import type { ConceptModule } from "@/lib/modules/concept-db";
import {
  updateConceptModule, deleteConceptModule, uploadConceptModulePdf,
  addConceptTask, updateConceptTask, deleteConceptTask, uploadConceptTaskPdf,
  addConceptQuestion, updateConceptQuestion, deleteConceptQuestion,
} from "../../actions";

export default function ConceptModuleEditor({ mod, slug }: { mod: ConceptModule; slug: string }) {
  const [isPending, startTransition] = useTransition();

  const [editingHeader, setEditingHeader] = useState(false);
  const [headerTitle, setHeaderTitle] = useState(mod.title);
  const [headerFocus, setHeaderFocus] = useState(mod.focus);
  const [headerVideo, setHeaderVideo] = useState(mod.video_url ?? "");
  const [headerContent, setHeaderContent] = useState(mod.content ?? "");
  const [headerPdfUrl, setHeaderPdfUrl] = useState(mod.pdf_url ?? "");
  const [pdfUploading, setPdfUploading] = useState(false);

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskText, setTaskText] = useState("");
  const [taskDuration, setTaskDuration] = useState("");
  const [taskLinkUrl, setTaskLinkUrl] = useState("");
  const [taskFileUrl, setTaskFileUrl] = useState("");
  const [taskPdfUploading, setTaskPdfUploading] = useState(false);
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDuration, setNewTaskDuration] = useState("");
  const [newTaskLinkUrl, setNewTaskLinkUrl] = useState("");

  const [editingQId, setEditingQId] = useState<string | null>(null);
  const [qQuestion, setQQuestion] = useState("");
  const [qOptions, setQOptions] = useState(["", "", "", ""]);
  const [qCorrect, setQCorrect] = useState(0);
  const [qExplanation, setQExplanation] = useState("");
  const [addingQ, setAddingQ] = useState(false);
  const [newQQuestion, setNewQQuestion] = useState("");
  const [newQOptions, setNewQOptions] = useState(["", "", "", ""]);
  const [newQCorrect, setNewQCorrect] = useState(0);
  const [newQExplanation, setNewQExplanation] = useState("");

  function startEditTask(t: ConceptModule["tasks"][0]) {
    setEditingTaskId(t.id);
    setTaskText(t.text);
    setTaskDuration(t.duration ?? "");
    setTaskLinkUrl(t.link_url ?? "");
    setTaskFileUrl(t.file_url ?? "");
  }

  function startEditQ(q: ConceptModule["quiz"][0]) {
    setEditingQId(q.id);
    setQQuestion(q.question);
    setQOptions([...q.options]);
    setQCorrect(q.correctIndex);
    setQExplanation(q.explanation);
  }

  return (
    <div className="space-y-8">
      {/* Module Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-nrg-charcoal">Module Info</h2>
          {!editingHeader && (
            <button onClick={() => setEditingHeader(true)} className="text-xs text-nrg-green hover:underline">Edit</button>
          )}
        </div>
        {editingHeader ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Title</label>
              <input value={headerTitle} onChange={(e) => setHeaderTitle(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Focus / Description</label>
              <textarea value={headerFocus} onChange={(e) => setHeaderFocus(e.target.value)} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Body Content (markdown — use [text](url) for links)</label>
              <textarea value={headerContent} onChange={(e) => setHeaderContent(e.target.value)} rows={6} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-y font-mono" placeholder="Context, SOPs, important links..." />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Video URL (YouTube or Vimeo)</label>
              <input value={headerVideo} onChange={(e) => setHeaderVideo(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="https://www.youtube.com/watch?v=..." />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">PDF</label>
              <div className="flex gap-2 items-center">
                <input value={headerPdfUrl} onChange={(e) => setHeaderPdfUrl(e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Paste PDF URL or upload" />
                <label className={`text-xs rounded-lg px-3 py-2 border cursor-pointer whitespace-nowrap ${pdfUploading ? "opacity-50" : "border-nrg-green text-nrg-green hover:bg-nrg-green/5"}`}>
                  {pdfUploading ? "Uploading…" : "Upload PDF"}
                  <input type="file" accept=".pdf" className="hidden" disabled={pdfUploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0]; if (!file) return;
                      setPdfUploading(true);
                      try { const fd = new FormData(); fd.append("file", file); const url = await uploadConceptModulePdf(mod.id, fd); setHeaderPdfUrl(url); }
                      finally { setPdfUploading(false); }
                    }}
                  />
                </label>
              </div>
              {headerPdfUrl && <a href={headerPdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-nrg-green hover:underline mt-1 inline-block">View current PDF ↗</a>}
            </div>
            <div className="flex gap-2">
              <button disabled={isPending} onClick={() => startTransition(async () => { await updateConceptModule(mod.id, slug, headerTitle, headerFocus, headerVideo, headerContent, headerPdfUrl); setEditingHeader(false); })} className="bg-nrg-green text-white text-xs rounded-lg px-4 py-2 hover:opacity-90 disabled:opacity-50">Save</button>
              <button onClick={() => setEditingHeader(false)} className="text-xs text-gray-400 hover:text-gray-600 px-3 py-2">Cancel</button>
              <button disabled={isPending} onClick={() => { if (!confirm("Delete this module?")) return; startTransition(() => deleteConceptModule(mod.id, slug)); }} className="ml-auto text-xs text-red-400 hover:text-red-600 disabled:opacity-50">Delete module</button>
            </div>
          </div>
        ) : (
          <div>
            <p className="font-medium text-nrg-charcoal">Day {mod.day}: {mod.title}</p>
            <p className="text-sm text-gray-500 mt-1">{mod.focus}</p>
            {mod.content && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{mod.content.slice(0, 120)}{mod.content.length > 120 ? "…" : ""}</p>}
            <div className="flex gap-3 mt-1">
              {mod.video_url && <p className="text-xs text-nrg-green">📹 Video attached</p>}
              {mod.pdf_url && <a href={mod.pdf_url} target="_blank" rel="noopener noreferrer" className="text-xs text-nrg-green hover:underline">📄 PDF attached ↗</a>}
            </div>
          </div>
        )}
      </div>

      {/* Tasks */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-nrg-charcoal">Tasks ({mod.tasks.length})</h2>
          <button onClick={() => setAddingTask(true)} className="text-xs text-nrg-green hover:underline">+ Add task</button>
        </div>
        <div className="space-y-2">
          {mod.tasks.map((t) => (
            <div key={t.id} className="border border-gray-100 rounded-xl p-3">
              {editingTaskId === t.id ? (
                <div className="space-y-2">
                  <input value={taskText} onChange={(e) => setTaskText(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" placeholder="Task description" />
                  <input value={taskDuration} onChange={(e) => setTaskDuration(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" placeholder="Duration (optional)" />
                  <input value={taskLinkUrl} onChange={(e) => setTaskLinkUrl(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" placeholder="Link URL (optional)" />
                  <div className="flex gap-2 items-center">
                    <input value={taskFileUrl} onChange={(e) => setTaskFileUrl(e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" placeholder="PDF URL (or upload)" />
                    <label className={`text-xs rounded-lg px-3 py-1.5 border cursor-pointer whitespace-nowrap ${taskPdfUploading ? "opacity-50" : "border-nrg-green text-nrg-green hover:bg-nrg-green/5"}`}>
                      {taskPdfUploading ? "Uploading…" : "Upload PDF"}
                      <input type="file" accept=".pdf" className="hidden" disabled={taskPdfUploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0]; if (!file) return;
                          setTaskPdfUploading(true);
                          try { const fd = new FormData(); fd.append("file", file); const url = await uploadConceptTaskPdf(t.id, fd); setTaskFileUrl(url); }
                          finally { setTaskPdfUploading(false); }
                        }}
                      />
                    </label>
                  </div>
                  {taskFileUrl && <a href={taskFileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-nrg-green hover:underline">View PDF ↗</a>}
                  <div className="flex gap-2">
                    <button disabled={isPending} onClick={() => startTransition(async () => { await updateConceptTask(t.id, slug, taskText, taskDuration, taskLinkUrl, taskFileUrl); setEditingTaskId(null); })} className="bg-nrg-green text-white text-xs rounded-lg px-3 py-1.5 hover:opacity-90 disabled:opacity-50">Save</button>
                    <button onClick={() => setEditingTaskId(null)} className="text-xs text-gray-400 hover:text-gray-600 px-2">Cancel</button>
                    <button disabled={isPending} onClick={() => { if (!confirm("Delete task?")) return; startTransition(async () => { await deleteConceptTask(t.id, slug); setEditingTaskId(null); }); }} className="ml-auto text-xs text-red-400 hover:text-red-600 disabled:opacity-50">Delete</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-nrg-charcoal">{t.text}</p>
                    {t.duration && <p className="text-xs text-gray-400 mt-0.5">{t.duration}</p>}
                    <div className="flex gap-3 mt-1">
                      {t.link_url && <a href={t.link_url} target="_blank" rel="noopener noreferrer" className="text-xs text-nrg-green hover:underline">🔗 Link ↗</a>}
                      {t.file_url && <a href={t.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-nrg-green hover:underline">📄 PDF ↗</a>}
                    </div>
                  </div>
                  <button onClick={() => startEditTask(t)} className="text-xs text-gray-400 hover:text-nrg-green flex-shrink-0">Edit</button>
                </div>
              )}
            </div>
          ))}

          {addingTask && (
            <div className="border border-nrg-green/30 rounded-xl p-3 space-y-2">
              <input value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" placeholder="Task description" autoFocus />
              <input value={newTaskDuration} onChange={(e) => setNewTaskDuration(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" placeholder="Duration (optional)" />
              <input value={newTaskLinkUrl} onChange={(e) => setNewTaskLinkUrl(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" placeholder="Link URL (optional)" />
              <p className="text-xs text-gray-400">PDF can be added after saving.</p>
              <div className="flex gap-2">
                <button disabled={isPending || !newTaskText.trim()} onClick={() => startTransition(async () => { await addConceptTask(mod.id, slug, newTaskText, newTaskDuration, newTaskLinkUrl, ""); setNewTaskText(""); setNewTaskDuration(""); setNewTaskLinkUrl(""); setAddingTask(false); })} className="bg-nrg-green text-white text-xs rounded-lg px-3 py-1.5 hover:opacity-90 disabled:opacity-50">Add</button>
                <button onClick={() => { setAddingTask(false); setNewTaskText(""); setNewTaskDuration(""); setNewTaskLinkUrl(""); }} className="text-xs text-gray-400 hover:text-gray-600 px-2">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quiz */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-nrg-charcoal">Quiz Questions ({mod.quiz.length})</h2>
          <button onClick={() => setAddingQ(true)} className="text-xs text-nrg-green hover:underline">+ Add question</button>
        </div>
        <div className="space-y-3">
          {mod.quiz.map((q, qi) => (
            <div key={q.id} className="border border-gray-100 rounded-xl p-4">
              {editingQId === q.id ? (
                <QuizForm question={qQuestion} options={qOptions} correctIndex={qCorrect} explanation={qExplanation}
                  onQuestion={setQQuestion} onOptions={setQOptions} onCorrect={setQCorrect} onExplanation={setQExplanation}
                  isPending={isPending}
                  onSave={() => startTransition(async () => { await updateConceptQuestion(q.id, slug, qQuestion, qOptions, qCorrect, qExplanation); setEditingQId(null); })}
                  onCancel={() => setEditingQId(null)}
                  onDelete={() => { if (!confirm("Delete question?")) return; startTransition(async () => { await deleteConceptQuestion(q.id, slug); setEditingQId(null); }); }}
                  showDelete
                />
              ) : (
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-1">Q{qi + 1}</p>
                    <p className="text-sm font-medium text-nrg-charcoal">{q.question}</p>
                    <div className="mt-2 space-y-1">
                      {q.options.map((opt, i) => (
                        <p key={i} className={`text-xs px-2 py-1 rounded ${i === q.correctIndex ? "bg-nrg-green/10 text-nrg-green font-medium" : "text-gray-500"}`}>
                          {i === q.correctIndex ? "✓ " : ""}{opt}
                        </p>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => startEditQ(q)} className="text-xs text-gray-400 hover:text-nrg-green flex-shrink-0">Edit</button>
                </div>
              )}
            </div>
          ))}

          {addingQ && (
            <div className="border border-nrg-green/30 rounded-xl p-4">
              <QuizForm question={newQQuestion} options={newQOptions} correctIndex={newQCorrect} explanation={newQExplanation}
                onQuestion={setNewQQuestion} onOptions={setNewQOptions} onCorrect={setNewQCorrect} onExplanation={setNewQExplanation}
                isPending={isPending}
                onSave={() => startTransition(async () => { await addConceptQuestion(mod.id, slug, newQQuestion, newQOptions, newQCorrect, newQExplanation); setNewQQuestion(""); setNewQOptions(["", "", "", ""]); setNewQCorrect(0); setNewQExplanation(""); setAddingQ(false); })}
                onCancel={() => { setAddingQ(false); setNewQQuestion(""); setNewQOptions(["", "", "", ""]); setNewQCorrect(0); setNewQExplanation(""); }}
                showDelete={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuizForm({ question, options, correctIndex, explanation, onQuestion, onOptions, onCorrect, onExplanation, isPending, onSave, onCancel, onDelete, showDelete }: {
  question: string; options: string[]; correctIndex: number; explanation: string;
  onQuestion: (v: string) => void; onOptions: (v: string[]) => void; onCorrect: (v: number) => void; onExplanation: (v: string) => void;
  isPending: boolean; onSave: () => void; onCancel: () => void; onDelete?: () => void; showDelete: boolean;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Question</label>
        <input value={question} onChange={(e) => onQuestion(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" placeholder="Question text" autoFocus />
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Answer options (select correct one)</label>
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2 mb-1.5">
            <input type="radio" name="correct" checked={correctIndex === i} onChange={() => onCorrect(i)} className="accent-nrg-green" />
            <input value={opt} onChange={(e) => { const next = [...options]; next[i] = e.target.value; onOptions(next); }} className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" placeholder={`Option ${i + 1}`} />
          </div>
        ))}
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Explanation</label>
        <textarea value={explanation} onChange={(e) => onExplanation(e.target.value)} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm resize-none" placeholder="Why is this the correct answer?" />
      </div>
      <div className="flex gap-2 items-center">
        <button disabled={isPending || !question.trim()} onClick={onSave} className="bg-nrg-green text-white text-xs rounded-lg px-3 py-1.5 hover:opacity-90 disabled:opacity-50">Save</button>
        <button onClick={onCancel} className="text-xs text-gray-400 hover:text-gray-600 px-2">Cancel</button>
        {showDelete && onDelete && <button disabled={isPending} onClick={onDelete} className="ml-auto text-xs text-red-400 hover:text-red-600 disabled:opacity-50">Delete</button>}
      </div>
    </div>
  );
}
