"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type NavItem = { label: string; href: string };
type BottomNavItem = NavItem & { icon: string; shortLabel: string };

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
  { label: "Property Training", href: "/manager/property-training" },
  { label: "Resources", href: "/manager/resources" },
  { label: "Ask NRG", href: "/manager/chat" },
  { label: "Staff", href: "/manager/staff" },
  { label: "My Profile", href: "/manager/profile" },
];

const corporateNav: NavItem[] = [
  { label: "Home", href: "/admin" },
  { label: "GM Progress", href: "/admin/gm-progress" },
  { label: "Staff", href: "/admin/staff" },
  { label: "Modules", href: "/admin/modules" },
  { label: "Resources", href: "/admin/resources" },
  { label: "Concepts", href: "/admin/concepts" },
  { label: "Ask NRG", href: "/admin/chat" },
];

const traineeBottomNav: BottomNavItem[] = [
  { label: "Home", shortLabel: "Home", href: "/trainee", icon: "🏠" },
  { label: "Steps of Service", shortLabel: "Steps", href: "/trainee/steps-of-service", icon: "📋" },
];

const managerBottomNav: BottomNavItem[] = [
  { label: "Home", shortLabel: "Home", href: "/manager", icon: "🏠" },
  { label: "GM Training", shortLabel: "GM", href: "/manager/gm-training", icon: "📚" },
  { label: "Property", shortLabel: "Property", href: "/manager/property-training", icon: "🏪" },
  { label: "Resources", shortLabel: "Resources", href: "/manager/resources", icon: "📋" },
  { label: "Staff", shortLabel: "Staff", href: "/manager/staff", icon: "👥" },
];

const corporateBottomNav: BottomNavItem[] = [
  { label: "Home", shortLabel: "Home", href: "/admin", icon: "🏠" },
  { label: "Progress", shortLabel: "Progress", href: "/admin/gm-progress", icon: "📊" },
  { label: "Staff", shortLabel: "Staff", href: "/admin/staff", icon: "👥" },
  { label: "Modules", shortLabel: "Modules", href: "/admin/modules", icon: "📦" },
  { label: "Concepts", shortLabel: "Concepts", href: "/admin/concepts", icon: "🏪" },
];

function isActive(pathname: string, href: string, isHome: boolean): boolean {
  if (isHome) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Navbar({ role, userName }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const navItems = role === "corporate" ? corporateNav : role === "manager" ? managerNav : traineeNav;
  const bottomNavItems = role === "corporate" ? corporateBottomNav : role === "manager" ? managerBottomNav : traineeBottomNav;
  const homeHrefs = ["/manager", "/admin", "/trainee"];

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      {/* Top header */}
      <header className="bg-nrg-green text-white">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-bold text-sm tracking-wide uppercase text-nrg-gold">
              NRG Training
            </span>
            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md text-sm transition ${
                    isActive(pathname, item.href, homeHrefs.includes(item.href))
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
      </header>

      {/* Mobile bottom tab bar */}
      <nav
        className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 flex z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {bottomNavItems.map((item) => {
          const active = isActive(pathname, item.href, homeHrefs.includes(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition ${
                active ? "text-nrg-green" : "text-gray-400"
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className={`text-[10px] font-medium leading-none ${active ? "text-nrg-green" : "text-gray-400"}`}>
                {item.shortLabel}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
