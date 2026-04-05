"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "How do I submit a payroll?",
  "What's the process for progressive discipline?",
  "How do I handle a facilities emergency?",
  "What are the accounting deadlines?",
  "How do I run a pre-shift meeting?",
];

function formatMessage(text: string) {
  // Very simple markdown: bold, bullets
  return text
    .split("\n")
    .map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <p key={i} className="font-semibold mt-2">{line.slice(2, -2)}</p>;
      }
      if (line.startsWith("- ") || line.startsWith("• ")) {
        return <li key={i} className="ml-4 list-disc">{line.slice(2)}</li>;
      }
      if (line.startsWith("## ")) {
        return <p key={i} className="font-bold text-nrg-charcoal mt-3">{line.slice(3)}</p>;
      }
      if (line.startsWith("### ")) {
        return <p key={i} className="font-semibold mt-2">{line.slice(4)}</p>;
      }
      if (line.trim() === "") return <br key={i} />;
      // Inline bold: **text**
      const parts = line.split(/\*\*(.*?)\*\*/g);
      if (parts.length > 1) {
        return (
          <p key={i}>
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j}>{part}</strong> : part
            )}
          </p>
        );
      }
      return <p key={i}>{line}</p>;
    });
}

export default function ChatClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "Sorry, I couldn't get a response." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Message thread */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[400px] max-h-[60vh] overflow-y-auto p-5 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="font-medium text-nrg-charcoal">Ask anything about NRG</p>
            <p className="text-sm text-gray-400 mt-1 mb-6">
              Policies, procedures, systems, best practices — I have the playbook.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs border border-gray-200 rounded-full px-3 py-1.5 text-gray-500 hover:border-nrg-green hover:text-nrg-green transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === "user"
                ? "bg-nrg-green text-white rounded-br-sm"
                : "bg-gray-50 text-nrg-charcoal rounded-bl-sm"
            }`}>
              {msg.role === "assistant" ? (
                <div className="space-y-0.5">{formatMessage(msg.content)}</div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={loading}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-nrg-charcoal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-nrg-green/30 focus:border-nrg-green disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-nrg-green text-white font-medium text-sm rounded-xl px-5 py-2.5 hover:bg-nrg-green/90 transition disabled:opacity-40"
        >
          Send
        </button>
      </form>

      {messages.length > 0 && (
        <button
          onClick={() => setMessages([])}
          className="text-xs text-gray-400 hover:text-gray-500 transition self-center"
        >
          Clear conversation
        </button>
      )}
    </div>
  );
}
