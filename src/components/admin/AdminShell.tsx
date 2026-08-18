"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Megaphone,
  Home,
  Files,
  Settings,
  Users,
  Inbox,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { Wordmark } from "@/components/site/Logo";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Articles", href: "/admin/articles", icon: FileText },
  { label: "Categories", href: "/admin/categories", icon: FolderOpen },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon },
  { label: "Advertising", href: "/admin/ads", icon: Megaphone },
  { label: "Homepage", href: "/admin/homepage", icon: Home },
  { label: "Pages", href: "/admin/pages", icon: Files },
  { label: "Audience", href: "/admin/audience", icon: Inbox },
  { label: "Team", href: "/admin/users", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) return;
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d?.user || null))
      .catch(() => {});
  }, [isLogin, pathname]);

  // Close the mobile drawer on navigation, adjusted during render per React guidance.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  if (isLogin) return <>{children}</>;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-rule px-6 py-5">
        <Wordmark className="text-[1.35rem]" href="/admin" />
        <p className="mt-1 font-sans text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted">
          Newsroom
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV.map((item) => {
          const active =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "mb-0.5 flex items-center gap-3 rounded px-3 py-2.5 font-sans text-[0.875rem] no-underline transition-colors",
                active
                  ? "bg-ink font-medium text-white"
                  : "text-ink-soft hover:bg-paper-2 hover:text-ink",
              )}
            >
              <item.icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-rule px-6 py-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 font-sans text-[0.8rem] text-muted no-underline hover:text-ink"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View site
        </Link>
        {user ? (
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="font-sans text-[0.85rem] font-medium">{user.name}</p>
              <p className="font-sans text-[0.72rem] capitalize text-muted">{user.role}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              aria-label="Sign out"
              className="p-1.5 text-muted transition-colors hover:text-accent"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-paper-2">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-rule bg-white lg:block">
        {sidebar}
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/30" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl animate-in">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 p-1.5 text-muted"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-rule bg-white px-5 lg:hidden">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <Wordmark className="text-[1.15rem]" href="/admin" />
        </header>
        <main className="flex-1 px-5 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
