import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import ResourcesClient from "./ResourcesClient";

export const metadata = { title: "Knowledge Base | NRG Training" };

const CATEGORY_ORDER = [
  "start-here",
  "manager-responsibilities",
  "accounting",
  "hr",
  "hiring-staffing",
  "repairs-maintenance",
  "marketing",
  "staff-training",
  "whos-who",
];

export default async function ResourcesPage() {
  const supabase = createAdminClient();

  const { data: documents } = await supabase
    .from("knowledge_documents")
    .select("id, title, content, category, category_label, applicable_states")
    .order("category")
    .order("title");

  const docs = documents ?? [];

  // Group by category
  const grouped = new Map<string, { label: string; docs: typeof docs }>();
  for (const doc of docs) {
    if (!grouped.has(doc.category)) {
      grouped.set(doc.category, { label: doc.category_label, docs: [] });
    }
    grouped.get(doc.category)!.docs.push(doc);
  }

  // Sort categories
  const sorted = CATEGORY_ORDER
    .filter((cat) => grouped.has(cat))
    .map((cat) => ({ category: cat, ...grouped.get(cat)! }));

  // Add any categories not in the order list
  for (const [cat, val] of grouped) {
    if (!CATEGORY_ORDER.includes(cat)) {
      sorted.push({ category: cat, ...val });
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-nrg-charcoal">Knowledge Base</h1>
          <p className="text-gray-500 text-sm mt-1">
            NRG Playbook — {docs.length} resources across {sorted.length} categories.
          </p>
        </div>
        <Link
          href="/admin/resources/manage"
          className="text-sm font-medium text-nrg-green hover:underline"
        >
          Manage →
        </Link>
      </div>
      <ResourcesClient groups={sorted} />
    </div>
  );
}
