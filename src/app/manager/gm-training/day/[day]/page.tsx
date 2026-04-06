import React from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getModuleFromDB, getModulesFromDB } from "@/lib/modules/db";
import TaskChecklist from "@/components/modules/TaskChecklist";
import ModuleNotes from "@/components/modules/ModuleNotes";
import SignOff from "@/components/modules/SignOff";
import Quiz from "@/components/modules/Quiz";

export const dynamic = "force-dynamic";

function MarkdownContent({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) return <h3 key={i} className="font-bold text-nrg-charcoal text-base mt-3 mb-1">{line.slice(3)}</h3>;
        if (line.startsWith("# ")) return <h2 key={i} className="font-bold text-nrg-charcoal text-lg mt-3 mb-1">{line.slice(2)}</h2>;
        if (line.startsWith("- ") || line.startsWith("• ")) return <li key={i} className="ml-4 list-disc text-sm">{renderInline(line.slice(2))}</li>;
        if (line.trim() === "") return <div key={i} className="h-2" />;
        return <p key={i} className="text-sm leading-relaxed">{renderInline(line)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  // Handle [text](url) links and **bold**
  const parts = text.split(/(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*)/g);
  return parts.map((part, i) => {
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) return <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-nrg-green hover:underline">{linkMatch[1]}</a>;
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) return <strong key={i}>{boldMatch[1]}</strong>;
    return part;
  });
}

function toEmbedUrl(url: string): string {
  // YouTube: watch?v=ID or youtu.be/ID
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo: vimeo.com/ID
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

export async function generateMetadata({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;
  const mod = await getModuleFromDB(Number(day));
  return { title: mod ? `Day ${mod.day}: ${mod.title} | NRG Training` : "Not Found" };
}

export default async function ModulePage({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;
  const mod = await getModuleFromDB(Number(day));
  if (!mod) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const allModules = await getModulesFromDB();
  const totalDays = allModules.length;

  const { data: progress } = await supabase
    .from("module_progress")
    .select("*, signed_off_by_user:signed_off_by(raw_user_meta_data)")
    .eq("user_id", user.id)
    .eq("module_id", mod.id)
    .maybeSingle();

  const { data: taskCompletions } = await supabase
    .from("module_task_completions")
    .select("task_index")
    .eq("user_id", user.id)
    .eq("module_id", mod.id);

  const completedTasks = new Set((taskCompletions ?? []).map((t) => t.task_index));

  const { data: quizAttempts } = await supabase
    .from("quiz_attempts")
    .select("score")
    .eq("user_id", user.id)
    .eq("module_id", mod.id)
    .order("score", { ascending: false })
    .limit(1);

  const bestScore = quizAttempts?.[0]?.score ?? null;

  const prevDay = mod.day > 1 ? mod.day - 1 : null;
  const nextDay = mod.day < totalDays ? mod.day + 1 : null;

  const signedOff = !!progress?.signed_off_at;
  const isComplete = !!progress?.completed_at;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/manager/gm-training" className="hover:text-nrg-green transition">
          GM Training
        </Link>
        <span>/</span>
        <span className="text-nrg-charcoal font-medium">Day {mod.day}</span>
      </div>

      <div className="flex items-start gap-4 mb-8">
        <span className="flex-shrink-0 w-12 h-12 rounded-full bg-nrg-green text-white text-lg font-bold flex items-center justify-center">
          {mod.day}
        </span>
        <div>
          <h1 className="text-2xl font-bold text-nrg-charcoal">{mod.title}</h1>
          <p className="text-gray-500 text-sm mt-1">{mod.focus}</p>
        </div>
        {(isComplete || signedOff) && (
          <div className="ml-auto flex flex-col items-end gap-1">
            {isComplete && (
              <span className="text-xs bg-green-100 text-green-700 rounded-full px-3 py-1 font-medium">
                Completed
              </span>
            )}
            {signedOff && (
              <span className="text-xs bg-nrg-gold/15 text-nrg-gold rounded-full px-3 py-1 font-medium">
                Signed off
              </span>
            )}
          </div>
        )}
      </div>

      {mod.content && (
        <section className="mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 prose prose-sm max-w-none text-gray-700">
            <MarkdownContent text={mod.content} />
          </div>
        </section>
      )}

      {mod.video_url && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Video
          </h2>
          <div className="rounded-2xl overflow-hidden aspect-video bg-black">
            <iframe
              src={toEmbedUrl(mod.video_url)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {mod.pdf_url && (
        <section className="mb-6">
          <a
            href={mod.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 hover:border-nrg-green transition group"
          >
            <span className="text-2xl">📄</span>
            <div>
              <p className="text-sm font-medium text-nrg-charcoal group-hover:text-nrg-green transition">View Reference Document</p>
              <p className="text-xs text-gray-400 mt-0.5">Opens PDF in new tab</p>
            </div>
            <span className="ml-auto text-nrg-green text-sm">↗</span>
          </a>
        </section>
      )}

      <section className="mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Tasks
        </h2>
        <TaskChecklist
          userId={user.id}
          moduleId={mod.id}
          tasks={mod.tasks}
          completedTasks={completedTasks}
          isComplete={isComplete}
        />
      </section>

      <section className="mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Notes
        </h2>
        <ModuleNotes
          userId={user.id}
          moduleId={mod.id}
          initialNotes={progress?.notes ?? ""}
        />
      </section>

      {mod.quiz.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Quiz
          </h2>
          <Quiz
            moduleId={mod.id}
            questions={mod.quiz}
            bestScore={bestScore}
          />
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Sign-off
        </h2>
        <SignOff
          userId={user.id}
          moduleId={mod.id}
          isComplete={isComplete}
          signedOff={signedOff}
          signedOffAt={progress?.signed_off_at ?? null}
          completedTaskCount={completedTasks.size}
          totalTaskCount={mod.tasks.length}
        />
      </section>

      <div className="flex justify-between pt-6 border-t border-gray-100">
        {prevDay ? (
          <Link
            href={`/manager/gm-training/day/${prevDay}`}
            className="text-sm text-gray-500 hover:text-nrg-green transition"
          >
            ← Day {prevDay}
          </Link>
        ) : <div />}
        {nextDay ? (
          <Link
            href={`/manager/gm-training/day/${nextDay}`}
            className="text-sm text-nrg-green font-medium hover:underline"
          >
            Day {nextDay} →
          </Link>
        ) : (
          <Link
            href="/manager/gm-training"
            className="text-sm text-nrg-gold font-medium hover:underline"
          >
            Back to overview →
          </Link>
        )}
      </div>
    </div>
  );
}
