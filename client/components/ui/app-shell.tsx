"use client";

import { ChangeEvent, KeyboardEvent, useContext, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  CircleUserRound,
  LayoutDashboard,
  Menu,
  Moon,
  Plus,
  Search,
  Settings,
  Ticket,
  X,
} from "lucide-react";

import { auth } from "@/firebase";
import { useAuth } from "@/lib/hooks/use-auth";
import { ThemeContext } from "@/lib/context/theme";

interface AppShellProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    href: "/tickets",
    label: "Ticket Queue",
    icon: <Ticket className="h-4 w-4" />,
  },
  {
    href: "/tickets/new",
    label: "New Ticket",
    icon: <Plus className="h-4 w-4" />,
  },
  {
    href: "/user",
    label: "Settings",
    icon: <Settings className="h-4 w-4" />,
  },
];

export default function AppShell({ children }: AppShellProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeContext = useContext(ThemeContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams?.get("q") || "");

  const initials = useMemo(() => {
    const source = user?.displayName || user?.email || "User";
    return source
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [user?.displayName, user?.email]);

  const role = pathname === "/dashboard" ? "Admin" : "Workspace";

  const handleSignOut = async () => {
    await auth.signOut();
    router.push("/");
  };

  useEffect(() => {
    setSearchValue(searchParams?.get("q") || "");
  }, [searchParams]);

  const toggleTheme = () => {
    if (!themeContext) {
      return;
    }

    themeContext.setTheme(themeContext.resolvedTheme === "Dark" ? "Light" : "Dark");
  };
  const isDarkMode = themeContext?.resolvedTheme === "Dark";

  const submitSearch = () => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    const trimmedSearch = searchValue.trim();

    if (trimmedSearch) {
      params.set("q", trimmedSearch);
    } else {
      params.delete("q");
    }

    router.push(`/tickets${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      submitSearch();
    }
  };

  const sidebar = (
    <aside className="flex h-full w-[244px] flex-col bg-[#1d2430] text-white dark:bg-[#0f1720]">
      <div className="flex h-[77px] items-center gap-3 border-b border-white/8 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#16a34a] shadow-[0_10px_30px_rgba(22,163,74,0.3)]">
          <Image src="/favicon.ico" alt="NestQueue logo" width={20} height={20} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold tracking-[0.01em]">
            NestQueue
          </p>
          <p className="text-[12px] text-[#8e99ab]">Classroom Edition</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isNewTicket = item.href === "/tickets/new";
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/" || pathname === "/dashboard"
                : isNewTicket
                  ? pathname === "/tickets/new"
                  : item.href === "/tickets"
                    ? pathname === "/tickets" || pathname.startsWith("/tickets/")
                      ? pathname !== "/tickets/new"
                      : false
                    : pathname.startsWith(item.href);

            const itemClassName = `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-semibold transition ${
              isActive
                ? "bg-[#16a34a] text-white shadow-[0_10px_24px_rgba(22,163,74,0.24)]"
                : "text-[#d6deea] hover:bg-white/6 hover:text-white"
            }`;

            return (
              <li key={`${item.href}-${item.label}`}>
                <Link
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={itemClassName}
                >
                  <span className={isActive ? "text-white" : "text-[#c2cad7]"}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/8 p-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[14px] font-semibold text-[#d6deea] transition hover:bg-white/6 hover:text-white"
        >
          <Moon className="h-4 w-4" />
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="h-screen overflow-hidden bg-[#eef3f9] text-[#1f2937] dark:bg-[#0b1220] dark:text-[#e5eef8]">
      <div className="flex h-full">
        <div className="hidden shrink-0 lg:block">{sidebar}</div>

        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <button
              type="button"
              className="flex-1 bg-[#0f172a]/45"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar"
            />
            <div className="h-full shrink-0 shadow-2xl">{sidebar}</div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-[#dbe2ee] bg-white dark:border-[#1e293b] dark:bg-[#111827]">
            <div className="flex h-[76px] items-center gap-4 px-5 lg:px-10">
              <button
                type="button"
                onClick={() => setIsSidebarOpen((open) => !open)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#e4e9f2] text-[#748199] dark:border-[#334155] dark:text-[#94a3b8] lg:hidden"
                aria-label="Toggle sidebar"
              >
                {isSidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>

              <div className="hidden max-w-[320px] flex-1 lg:block">
                <div className="flex h-12 items-center gap-3 rounded-2xl border border-[#edf1f7] bg-[#f7f9fc] px-4 text-[#7c889d] dark:border-[#334155] dark:bg-[#1f2937] dark:text-[#94a3b8]">
                  <Search className="h-4 w-4" />
                  <input
                    type="search"
                    value={searchValue}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search tickets..."
                    className="h-full w-full bg-transparent text-[15px] text-[#334155] outline-none placeholder:text-[#7c889d] dark:text-[#f8fafc] dark:placeholder:text-[#94a3b8]"
                  />
                </div>
              </div>

              <div className="ml-auto flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[14px] font-semibold text-[#2d3748] dark:text-[#f8fafc]">
                    {user?.displayName || user?.email || "NestQueue User"}
                  </p>
                  <p className="text-[14px] text-[#8a94a6] dark:text-[#94a3b8]">{role}</p>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#dcfce7] text-[15px] font-semibold text-[#15803d] dark:bg-[#14532d] dark:text-[#bbf7d0]"
                  aria-label="Sign out"
                >
                  {user?.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.photoURL}
                      alt="User avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : initials ? (
                    initials
                  ) : (
                    <CircleUserRound className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-auto px-4 py-5 lg:px-6 lg:py-7 xl:px-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
