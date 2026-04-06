import { createAdminClient } from "@/lib/supabase/server";
import { getModulesFromDB } from "@/lib/modules/db";
import StaffClient from "./StaffClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Staff Management | NRG Training" };

export default async function AdminStaffPage() {
  const admin = createAdminClient();

  const [
    { data: authData },
    { data: concepts },
    modules,
    { data: progressRows },
  ] = await Promise.all([
    admin.auth.admin.listUsers(),
    admin.from("concepts").select("id, name, state").order("state").order("name"),
    getModulesFromDB(),
    admin.from("module_progress").select("user_id, completed_at").not("completed_at", "is", null),
  ]);

  // Count completed modules per user
  const completionMap = new Map<string, number>();
  for (const row of progressRows ?? []) {
    completionMap.set(row.user_id, (completionMap.get(row.user_id) ?? 0) + 1);
  }

  const users = (authData?.users ?? [])
    .filter((u) => u.user_metadata?.role)
    .sort((a, b) => {
      const roleOrder = ["corporate", "do", "manager", "trainee"];
      const ra = roleOrder.indexOf(a.user_metadata?.role) ?? 99;
      const rb = roleOrder.indexOf(b.user_metadata?.role) ?? 99;
      return ra - rb || (a.email ?? "").localeCompare(b.email ?? "");
    })
    .map((u) => ({
      id: u.id,
      email: u.email ?? "",
      full_name: u.user_metadata?.full_name ?? "",
      role: u.user_metadata?.role ?? "trainee",
      concept_id: u.user_metadata?.concept_id ?? null,
      modules_complete: completionMap.get(u.id) ?? 0,
    }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-nrg-charcoal">Staff Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          {users.length} user{users.length !== 1 ? "s" : ""} · Invite, assign roles, and link to restaurant concepts.
        </p>
      </div>
      <StaffClient
        users={users}
        concepts={concepts ?? []}
        totalModules={modules.length}
      />
    </div>
  );
}
