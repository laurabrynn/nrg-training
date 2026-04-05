"use client";

import { useState, useTransition } from "react";
import {
  updateModule,
  addTask,
  updateTask,
  deleteTask,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from "../actions";

type Task = { id: string; text: string; duration: string | null; sort_order: number };
type Question = {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  sort_order: number;
};
type Mod = { id: string; day: number; title: string; focus: string; video_url: string | null };

export default function ModuleEditor({
  mod,
  tasks,
  questions,
}: {
  mod: Mod;
  tasks: Task[];
  questions: Question[];
}) {
  const [isPending, startTransition] = useTransition();

  // Module header edit
  const [editingHeader, setEditingHeader] = useState(false);
  const [headerTitle, setHeaderTitle] = useState(mod.title);
  const [headerFocus, setHeaderFocus] = useState(mod.focus);
  const [headerVideo, setHeaderVideo] = useState(mod.video_url ?? "");

  // Task state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskText, setTaskText] = useState("");
  const [taskDuration, setTaskDuration] = useState("");
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDuration, setNewTaskDuration] = useState("");

  // Question state
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

  function startEditTask(t: Task) {
    setEditingTaskId(t.id);
    setTaskText(t.text);
    setTaskDuration(t.duration ?? "");
  }

  function startEditQuestion(q: Question) {
    setEditingQId(q.id);
    setQQuestion(q.question);
    setQOptions([...q.options]);
    setQCorrect(q.correct_index);
    setQExplanation(q.explanation);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-nrg-charcoal">Module Info</h2>
          {!editingHeader && (
            <button
              onClick={() => setEditingHeader(true)}
              className="text-xs text-nrg-green hover:underline"
            >
              Edit
            </button>
          )}
        </div>
        {editingHeader ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Title</label>
              <input
                value={headerTitle}
                onChange={(e) => setHeaderTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Focus / Description</label>
              <textarea
                value={headerFocus}
                onChange={(e) => setHeaderFocus(e.target.value)}
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Video URL (YouTube, Vimeo, or direct link)</label>
              <input
                value={headerVideo}
                onChange={(e) => setHeaderVideo(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <div className="flex gap-2">
              <button
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    await updateModule(mod.id, headerTitle, headerFocus, headerVideo);
                    setEditingHeader(false);
                  });
                }}
                className="bg-nrg-green text-white text-xs rounded-lg px-4 py-2 hover:opacity-90 disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => { setHeaderTitle(mod.title); setHeaderFocus(mod.focus); setHeaderVideo(mod.video_url ?? ""); setEditingHeader(false); }}
                className="text-xs text-gray-400 hover:text-gray-600 px-3 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="font-medium text-nrg-charcoal">Day {mod.day}: {mod.title}</p>
            <p className="text-sm text-gray-500 mt-1">{mod.focus}</p>
            {mod.video_url && (
              <p className="text-xs text-nrg-green mt-1 truncate">Video: {mod.video_url}</p>
            )}
          </div>
        )}
      </div>

      {/* Tasks */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-nrg-charcoal">Tasks ({tasks.length})</h2>
          <button
            onClick={() => setAddingTask(true)}
            className="text-xs text-nrg-green hover:underline"
          >
            + Add task
          </button>
        </div>

        <div className="space-y-2">
          {tasks.map((t) => (
            <div key={t.id} className="border border-gray-100 rounded-xl p-3">
              {editingTaskId === t.id ? (
                <div className="space-y-2">
                  <input
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                    placeholder="Task description"
                  />
                  <input
                    value={taskDuration}
                    onChange={(e) => setTaskDuration(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                    placeholder="Duration (optional, e.g. 30 min)"
                  />
                  <div className="flex gap-2">
                    <button
                      disabled={isPending}
                      onClick={() => startTransition(async () => {
                        await updateTask(t.id, taskText, taskDuration);
                        setEditingTaskId(null);
                      })}
                      className="bg-nrg-green text-white text-xs rounded-lg px-3 py-1.5 hover:opacity-90 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTaskId(null)}
                      className="text-xs text-gray-400 hover:text-gray-600 px-2"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isPending}
                      onClick={() => {
                        if (!confirm("Delete this task?")) return;
                        startTransition(async () => {
                          await deleteTask(t.id);
                          setEditingTaskId(null);
                        });
                      }}
                      className="ml-auto text-xs text-red-400 hover:text-red-600 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-nrg-charcoal">{t.text}</p>
                    {t.duration && <p className="text-xs text-gray-400 mt-0.5">{t.duration}</p>}
                  </div>
                  <button
                    onClick={() => startEditTask(t)}
                    className="text-xs text-gray-400 hover:text-nrg-green flex-shrink-0"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}

          {addingTask && (
            <div className="border border-nrg-green/30 rounded-xl p-3 space-y-2">
              <input
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                placeholder="Task description"
                autoFocus
              />
              <input
                value={newTaskDuration}
                onChange={(e) => setNewTaskDuration(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                placeholder="Duration (optional, e.g. 30 min)"
              />
              <div className="flex gap-2">
                <button
                  disabled={isPending || !newTaskText.trim()}
                  onClick={() => startTransition(async () => {
                    await addTask(mod.id, newTaskText, newTaskDuration);
                    setNewTaskText("");
                    setNewTaskDuration("");
                    setAddingTask(false);
                  })}
                  className="bg-nrg-green text-white text-xs rounded-lg px-3 py-1.5 hover:opacity-90 disabled:opacity-50"
                >
                  Add
                </button>
                <button
                  onClick={() => { setAddingTask(false); setNewTaskText(""); setNewTaskDuration(""); }}
                  className="text-xs text-gray-400 hover:text-gray-600 px-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Questions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-nrg-charcoal">Quiz Questions ({questions.length})</h2>
          <button
            onClick={() => setAddingQ(true)}
            className="text-xs text-nrg-green hover:underline"
          >
            + Add question
          </button>
        </div>

        <div className="space-y-3">
          {questions.map((q, qi) => (
            <div key={q.id} className="border border-gray-100 rounded-xl p-4">
              {editingQId === q.id ? (
                <QuestionForm
                  question={qQuestion}
                  options={qOptions}
                  correctIndex={qCorrect}
                  explanation={qExplanation}
                  onQuestion={setQQuestion}
                  onOptions={setQOptions}
                  onCorrect={setQCorrect}
                  onExplanation={setQExplanation}
                  isPending={isPending}
                  onSave={() => startTransition(async () => {
                    await updateQuestion(q.id, qQuestion, qOptions, qCorrect, qExplanation);
                    setEditingQId(null);
                  })}
                  onCancel={() => setEditingQId(null)}
                  onDelete={() => {
                    if (!confirm("Delete this question?")) return;
                    startTransition(async () => {
                      await deleteQuestion(q.id);
                      setEditingQId(null);
                    });
                  }}
                  showDelete
                />
              ) : (
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-1">Q{qi + 1}</p>
                    <p className="text-sm font-medium text-nrg-charcoal">{q.question}</p>
                    <div className="mt-2 space-y-1">
                      {q.options.map((opt, i) => (
                        <p key={i} className={`text-xs px-2 py-1 rounded ${i === q.correct_index ? "bg-nrg-green/10 text-nrg-green font-medium" : "text-gray-500"}`}>
                          {i === q.correct_index ? "✓ " : ""}{opt}
                        </p>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => startEditQuestion(q)}
                    className="text-xs text-gray-400 hover:text-nrg-green flex-shrink-0"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}

          {addingQ && (
            <div className="border border-nrg-green/30 rounded-xl p-4">
              <QuestionForm
                question={newQQuestion}
                options={newQOptions}
                correctIndex={newQCorrect}
                explanation={newQExplanation}
                onQuestion={setNewQQuestion}
                onOptions={setNewQOptions}
                onCorrect={setNewQCorrect}
                onExplanation={setNewQExplanation}
                isPending={isPending}
                onSave={() => startTransition(async () => {
                  await addQuestion(mod.id, newQQuestion, newQOptions, newQCorrect, newQExplanation);
                  setNewQQuestion("");
                  setNewQOptions(["", "", "", ""]);
                  setNewQCorrect(0);
                  setNewQExplanation("");
                  setAddingQ(false);
                })}
                onCancel={() => {
                  setAddingQ(false);
                  setNewQQuestion("");
                  setNewQOptions(["", "", "", ""]);
                  setNewQCorrect(0);
                  setNewQExplanation("");
                }}
                showDelete={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuestionForm({
  question, options, correctIndex, explanation,
  onQuestion, onOptions, onCorrect, onExplanation,
  isPending, onSave, onCancel, onDelete, showDelete,
}: {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  onQuestion: (v: string) => void;
  onOptions: (v: string[]) => void;
  onCorrect: (v: number) => void;
  onExplanation: (v: string) => void;
  isPending: boolean;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  showDelete: boolean;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Question</label>
        <input
          value={question}
          onChange={(e) => onQuestion(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
          placeholder="Question text"
          autoFocus
        />
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Answer options (select the correct one)</label>
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2 mb-1.5">
            <input
              type="radio"
              name="correct"
              checked={correctIndex === i}
              onChange={() => onCorrect(i)}
              className="accent-nrg-green"
            />
            <input
              value={opt}
              onChange={(e) => {
                const next = [...options];
                next[i] = e.target.value;
                onOptions(next);
              }}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
              placeholder={`Option ${i + 1}`}
            />
          </div>
        ))}
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Explanation (shown after answering)</label>
        <textarea
          value={explanation}
          onChange={(e) => onExplanation(e.target.value)}
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm resize-none"
          placeholder="Why is this the correct answer?"
        />
      </div>
      <div className="flex gap-2 items-center">
        <button
          disabled={isPending || !question.trim()}
          onClick={onSave}
          className="bg-nrg-green text-white text-xs rounded-lg px-3 py-1.5 hover:opacity-90 disabled:opacity-50"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="text-xs text-gray-400 hover:text-gray-600 px-2"
        >
          Cancel
        </button>
        {showDelete && onDelete && (
          <button
            disabled={isPending}
            onClick={onDelete}
            className="ml-auto text-xs text-red-400 hover:text-red-600 disabled:opacity-50"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
