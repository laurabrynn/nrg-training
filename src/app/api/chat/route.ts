import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  // Verify user is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { message, history } = await req.json();
  if (!message) return NextResponse.json({ error: "No message" }, { status: 400 });

  // Search knowledge base for relevant documents (simple keyword search)
  const adminClient = createAdminClient();
  const keywords = message.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
  const searchQuery = keywords.slice(0, 5).join(" | ");

  let context = "";
  if (searchQuery) {
    const { data: docs } = await adminClient
      .from("knowledge_documents")
      .select("title, content, category_label")
      .textSearch("content", searchQuery, { type: "websearch" })
      .limit(5);

    if (docs && docs.length > 0) {
      context = docs
        .map((d) => `**${d.title}** (${d.category_label})\n${d.content}`)
        .join("\n\n---\n\n");
    }
  }

  const systemPrompt = `You are an NRG (Neighborhood Restaurant Group) training assistant helping managers and staff find information about policies, procedures, and best practices.

You have access to the NRG Playbook — a collection of SOPs, guides, and resources. Answer questions based on this knowledge base. Be concise and practical. If you reference a specific document, name it.

${context ? `## Relevant knowledge base entries:\n\n${context}` : "No specific documents matched this query — answer based on general restaurant management knowledge if helpful, but note that specific NRG policies may be in the playbook."}

Keep answers focused and actionable. Use bullet points for steps or lists.`;

  const messages = [
    ...(history ?? []),
    { role: "user" as const, content: message },
  ];

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const reply = response.content[0].type === "text" ? response.content[0].text : "";

  return NextResponse.json({ reply });
}
