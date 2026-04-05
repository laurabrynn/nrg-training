import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/nav/Navbar";

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const role = user.user_metadata?.role ?? "trainee";
  if (role !== "manager") redirect("/trainee");

  const userName = user.user_metadata?.full_name ?? user.email ?? undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar role="manager" userName={userName} />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">{children}</main>
    </div>
  );
}
