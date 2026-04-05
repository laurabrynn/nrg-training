import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const modules = [
  {
    title: "Junebug Steps of Service",
    description: "The full sequence of hospitality — from welcome to farewell.",
    href: "/trainee/steps-of-service",
    icon: "🍽️",
    status: "Start",
  },
];

export default async function TraineeDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] ?? "there";

  return (
    <div>
      <h1 className="text-2xl font-bold text-nrg-charcoal mb-1">
        Hey, {firstName}!
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Welcome to your training portal. Work through the modules below at your own pace.
      </p>

      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
        Your Modules
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map((mod) => (
          <Link
            key={mod.href}
            href={mod.href}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4 hover:shadow-md transition group"
          >
            <div className="text-3xl leading-none">{mod.icon}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-nrg-charcoal group-hover:text-nrg-green transition">
                {mod.title}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{mod.description}</p>
            </div>
            <span className="text-xs font-medium text-nrg-gold shrink-0 mt-0.5">
              {mod.status} &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
