import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import ManageClient, { AddButton } from "./ManageClient";

export const metadata = { title: "Manage Resources | NRG Training" };

export default async function ManageResourcesPage() {
  const supabase = createAdminClient();

  const { data: documents } = await supabase
    .from("knowledge_documents")
    .select("id, title, content, category, category_label, applicable_states, source")
    .order("category_label")
    .order("title");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link href="/admin/resources" className="hover:text-nrg-green transition">Resources</Link>
            <span>/</span>
            <span className="text-nrg-charcoal font-medium">Manage</span>
          </div>
          <h1 className="text-2xl font-bold text-nrg-charcoal">Manage Documents</h1>
          <p className="text-gray-500 text-sm mt-1">{documents?.length ?? 0} documents in the knowledge base.</p>
        </div>
        <AddButton />
      </div>
      <ManageClient documents={documents ?? []} />
    </div>
  );
}
