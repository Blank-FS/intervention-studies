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
    <main className="min-h-0 flex-1 bg-[#141414]/70 p-6">
      {/* Tab Controls */}
      <div className="flex h-full min-h-0 w-full flex-col">
        <div className="flex border-b border-white">
          <Link
            href="/researcher"
            className={cn(
              `w-36 rounded-tl-lg border p-2 text-center font-bold`,
              isActive("/researcher")
                ? "bg-umich-maize text-umich-blue"
                : "bg-umich-blue/50 text-umich-maize",
            )}
          >
            Home
          </Link>

          <Link
            href="/researcher/users"
            className={cn(
              `w-36 border p-2 text-center font-bold`,
              isActive("/researcher/users")
                ? "bg-umich-maize text-umich-blue"
                : "bg-umich-blue/50 text-umich-maize",
            )}
          >
            Users
          </Link>

          <Link
            href="/researcher/flu-study"
            className={cn(
              `w-36 rounded-tr-lg border p-2 text-center font-bold`,
              isActive("/researcher/flu-study")
                ? "bg-umich-maize text-umich-blue"
                : "bg-umich-blue/50 text-umich-maize",
            )}
          >
            Flu Study
          </Link>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </main>
  );
}
