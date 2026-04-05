import { createClient, createAdminClient } from "@/lib/supabase/server";
import AssignProperty from "@/components/admin/AssignProperty";

export const metadata = { title: "Staff Management | NRG Training" };

export default async function AdminStaffPage() {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const { data: users } = await adminClient.auth.admin.listUsers();
  const { data: properties } = await supabase.from("properties").select("*").order("state").order("name");
  const { data: assignments } = await supabase.from("user_properties").select("user_id, property_id");

  const assignmentMap = new Map<string, string>();
  for (const a of assignments ?? []) {
    assignmentMap.set(a.user_id, a.property_id);
  }

  const staff = (users?.users ?? [])
    .filter((u) => u.user_metadata?.role && u.user_metadata.role !== "corporate")
    .sort((a, b) => {
      const ra = a.user_metadata?.role ?? "";
      const rb = b.user_metadata?.role ?? "";
      return ra.localeCompare(rb) || (a.email ?? "").localeCompare(b.email ?? "");
    });

  const roleLabel: Record<string, string> = {
    manager: "GM",
    do: "Director of Operations",
    trainee: "Trainee",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-nrg-charcoal">Staff Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage roles and assign GMs to their properties.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Name / Email</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Role</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Property</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {staff.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                  No staff yet. Invite users via Supabase Authentication.
                </td>
              </tr>
            )}
            {staff.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <p className="font-medium text-nrg-charcoal">
                    {u.user_metadata?.full_name ?? "—"}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">{u.email}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium rounded-full px-2.5 py-1 ${
                    u.user_metadata?.role === "do"
                      ? "bg-nrg-gold/15 text-nrg-gold"
                      : u.user_metadata?.role === "manager"
                      ? "bg-nrg-green/10 text-nrg-green"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {roleLabel[u.user_metadata?.role] ?? u.user_metadata?.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <AssignProperty
                    userId={u.id}
                    properties={properties ?? []}
                    currentPropertyId={assignmentMap.get(u.id) ?? null}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
