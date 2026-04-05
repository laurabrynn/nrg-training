"use client";

import { useState, useTransition } from "react";
import type { QuizQuestion } from "@/lib/modules/gm-training";
import { saveQuizAttempt } from "@/app/actions/quiz";

interface Props {
  moduleId: string;
  questions: QuizQuestion[];
  bestScore: number | null; // 0–100 from previous attempts
}

export default function Quiz({ moduleId, questions, bestScore }: Props) {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [finished, setFinished] = useState(false);
  const [isPending, startTransition] = useTransition();

  const current = questions[currentIndex];
  const isAnswered = selected !== null;
  const isCorrect = selected === current?.correctIndex;

  function handleSelect(idx: number) {
    if (isAnswered) return;
    setSelected(idx);
    const next = [...answers];
    next[currentIndex] = idx;
    setAnswers(next);
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(answers[currentIndex + 1]);
    } else {
      const correct = answers.filter((a, i) => a === questions[i].correctIndex).length;
      const score = Math.round((correct / questions.length) * 100);
      startTransition(async () => {
        await saveQuizAttempt(moduleId, score, correct, questions.length);
      });
      setFinished(true);
    }
  }

  function handleRetake() {
    setStarted(false);
    setCurrentIndex(0);
    setSelected(null);
    setAnswers(Array(questions.length).fill(null));
    setFinished(false);
  }

  const correctCount = answers.filter((a, i) => a === questions[i].correctIndex).length;
  const finalScore = finished ? Math.round((correctCount / questions.length) * 100) : null;

  if (!started) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-nrg-charcoal text-base">Module Quiz</h3>
            <p className="text-xs text-gray-400 mt-0.5">{questions.length} questions</p>
          </div>
          {bestScore !== null && (
            <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
              bestScore >= 80 ? "bg-nrg-green/10 text-nrg-green" : "bg-nrg-gold/15 text-nrg-gold"
            }`}>
              Best: {bestScore}%
            </div>
          )}
        </div>
        {bestScore !== null && (
          <p className="text-xs text-gray-400 mb-4">
            {bestScore >= 80 ? "You passed this quiz." : "Keep practicing to improve your score."} You can retake it any time.
          </p>
        )}
        <button
          onClick={() => setStarted(true)}
          className="w-full bg-nrg-green text-white font-medium text-sm rounded-xl py-2.5 hover:bg-nrg-green/90 transition"
        >
          {bestScore !== null ? "Retake Quiz" : "Start Quiz"}
        </button>
      </div>
    );
  }

  if (finished) {
    const passed = (finalScore ?? 0) >= 80;
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="text-center mb-6">
          <div className={`text-5xl font-bold mb-1 ${passed ? "text-nrg-green" : "text-nrg-gold"}`}>
            {finalScore}%
          </div>
          <p className="text-sm text-gray-500">
            {correctCount} of {questions.length} correct
          </p>
          <p className={`text-sm font-medium mt-2 ${passed ? "text-nrg-green" : "text-nrg-gold"}`}>
            {passed ? "Passed!" : "Not quite — 80% to pass"}
          </p>
        </div>

        {/* Answer review */}
        <div className="space-y-3 mb-6">
          {questions.map((q, i) => {
            const userAnswer = answers[i];
            const correct = userAnswer === q.correctIndex;
            return (
              <div key={i} className={`rounded-xl p-3 text-sm ${correct ? "bg-nrg-green/5 border border-nrg-green/20" : "bg-red-50 border border-red-100"}`}>
                <p className="font-medium text-nrg-charcoal mb-1">{q.question}</p>
                {!correct && (
                  <p className="text-xs text-gray-500">
                    Your answer: <span className="text-red-500">{userAnswer !== null ? q.options[userAnswer] : "skipped"}</span>
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Correct: <span className="text-nrg-green font-medium">{q.options[q.correctIndex]}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">{q.explanation}</p>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleRetake}
          className="w-full border border-gray-200 text-nrg-charcoal font-medium text-sm rounded-xl py-2.5 hover:bg-gray-50 transition"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-nrg-charcoal text-base">Module Quiz</h3>
        <span className="text-xs text-gray-400">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-5">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i < currentIndex
                ? answers[i] === questions[i].correctIndex
                  ? "bg-nrg-green"
                  : "bg-red-300"
                : i === currentIndex
                ? "bg-nrg-charcoal"
                : "bg-gray-100"
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <p className="font-medium text-nrg-charcoal text-sm mb-4">{current.question}</p>

      {/* Options */}
      <div className="space-y-2 mb-4">
        {current.options.map((opt, idx) => {
          let style = "border-gray-200 text-nrg-charcoal hover:border-nrg-green/50 hover:bg-nrg-green/5";
          if (isAnswered) {
            if (idx === current.correctIndex) {
              style = "border-nrg-green bg-nrg-green/10 text-nrg-green font-medium";
            } else if (idx === selected) {
              style = "border-red-300 bg-red-50 text-red-500";
            } else {
              style = "border-gray-100 text-gray-300";
            }
          } else if (selected === idx) {
            style = "border-nrg-green bg-nrg-green/5 text-nrg-green";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`w-full text-left text-sm border rounded-xl px-4 py-2.5 transition-all ${style}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {isAnswered && (
        <div className={`text-xs rounded-lg px-3 py-2 mb-4 ${isCorrect ? "bg-nrg-green/5 text-nrg-green" : "bg-red-50 text-red-500"}`}>
          {isCorrect ? "Correct! " : "Not quite. "}{current.explanation}
        </div>
      )}

      {/* Next / Submit */}
      {isAnswered && (
        <button
          onClick={handleNext}
          disabled={isPending}
          className="w-full bg-nrg-green text-white font-medium text-sm rounded-xl py-2.5 hover:bg-nrg-green/90 transition"
        >
          {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
        </button>
      )}
    </div>
  );
}
