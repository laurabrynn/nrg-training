import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import ManageClient, { AddButton, UploadPdfButton } from "./ManageClient";

export const metadata = { title: "Manage Resources | NRG Training" };

export default async function ManageResourcesPage() {
  const supabase = createAdminClient();

  const [{ data: documents }, { data: concepts }] = await Promise.all([
    supabase
      .from("knowledge_documents")
      .select("id, title, content, category, category_label, applicable_states, source, file_url")
      .order("category_label")
      .order("title"),
    supabase.from("concepts").select("id, name, slug, state").order("state").order("name"),
  ]);

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
        <div className="flex gap-2">
          <UploadPdfButton concepts={concepts ?? []} />
          <AddButton concepts={concepts ?? []} />
        </div>
      </div>
      <ManageClient documents={documents ?? []} concepts={concepts ?? []} />
    </div>
  );
}
