"use client";

import LogoutButton from "@/components/LogoutButton";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ResearcherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname == path;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-muted flex items-center justify-between px-6 py-3 shadow">
        <h1 className="text-lg font-bold">Researcher Dashboard</h1>
        <LogoutButton />
      </header>

      {/* Main content area */}
      <main className="flex-1 p-4">
        {/* Tab Controls */}
        <div>
          <div className="flex border-b border-white">
            <Link
              href="/researcher"
              className={cn(
                `w-36 rounded-tl-lg border p-2 text-center`,
                isActive("/researcher") ? "bg-muted-foreground" : "bg-muted",
              )}
            >
              Home
            </Link>

            <Link
              href="/researcher/users"
              className={cn(
                `w-36 border p-2 text-center`,
                isActive("/researcher/users")
                  ? "bg-muted-foreground"
                  : "bg-muted",
              )}
            >
              Users
            </Link>

            <Link
              href="/researcher/modules"
              className={cn(
                `w-36 rounded-tr-lg border p-2 text-center`,
                isActive("/researcher/modules")
                  ? "bg-muted-foreground"
                  : "bg-muted",
              )}
            >
              Modules
            </Link>
          </div>

          {/* Tab Content */}
          <div className="py-4">{children}</div>
        </div>
      </main>
    </div>
  );
}
