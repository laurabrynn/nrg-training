import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const tools = [
  { title: "GM Progress", description: "View training progress across all general managers.", href: "/admin/gm-progress", icon: "📊" },
  { title: "Staff Management", description: "Manage accounts, roles, and property assignments.", href: "/admin/staff", icon: "👥" },
  { title: "Knowledge Base", description: "Add and manage training resources and documents.", href: "/admin/resources", icon: "📚" },
];

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] ?? "there";
  const role = user?.user_metadata?.role;

  return (
    <div>
      <h1 className="text-2xl font-bold text-nrg-charcoal mb-1">
        Hey, {firstName}
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        {role === "corporate" ? "Corporate" : "Director of Operations"} portal — training oversight and content management.
      </p>

      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
        Admin Tools
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4 hover:shadow-md transition group"
          >
            <div className="text-3xl leading-none">{t.icon}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-nrg-charcoal group-hover:text-nrg-green transition">{t.title}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{t.description}</p>
            </div>
            <span className="text-xs font-medium text-nrg-gold shrink-0 mt-0.5">Open →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
