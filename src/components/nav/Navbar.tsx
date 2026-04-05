"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type NavItem = { label: string; href: string };

interface NavbarProps {
  role: "trainee" | "manager" | "corporate";
  userName?: string;
}

const traineeNav: NavItem[] = [
  { label: "Home", href: "/trainee" },
  { label: "Steps of Service", href: "/trainee/steps-of-service" },
];

const managerNav: NavItem[] = [
  { label: "Home", href: "/manager" },
  { label: "GM Training", href: "/manager/gm-training" },
  { label: "Resources", href: "/manager/resources" },
  { label: "Ask NRG", href: "/manager/chat" },
  { label: "Staff", href: "/manager/staff" },
];

const corporateNav: NavItem[] = [
  { label: "Home", href: "/admin" },
  { label: "GM Progress", href: "/admin/gm-progress" },
  { label: "Staff", href: "/admin/staff" },
  { label: "Resources", href: "/admin/resources" },
  { label: "Ask NRG", href: "/admin/chat" },
];

export default function Navbar({ role, userName }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const navItems = role === "corporate" ? corporateNav : role === "manager" ? managerNav : traineeNav;

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="bg-nrg-green text-white">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-sm tracking-wide uppercase text-nrg-gold">
            NRG Training
          </span>
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-sm transition ${
                  pathname === item.href
                    ? "bg-white/20 font-medium"
                    : "hover:bg-white/10 text-white/80"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {userName && (
            <span className="text-xs text-white/60 hidden sm:inline">{userName}</span>
          )}
          <button
            onClick={handleSignOut}
            className="text-xs text-white/70 hover:text-white transition"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="sm:hidden flex gap-1 px-4 pb-2 overflow-x-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap px-3 py-1 rounded-md text-xs transition ${
              pathname === item.href
                ? "bg-white/20 font-medium"
                : "hover:bg-white/10 text-white/80"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
