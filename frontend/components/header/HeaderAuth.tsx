"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { LogOutIcon } from "lucide-react";
import { Badge } from "../ui/badge";

export default function HeaderAuth() {
  const { user: loggedInUser, refresh } = useAuth();
  const router = useRouter();
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await refresh();
    router.push("/");
  };

  if (!loggedInUser) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <p className="text-sm">Logged in as:</p>
      <Badge variant="outline">{loggedInUser.email}</Badge>
      <Button
        onClick={handleLogout}
        className="bg-umich-maize text-umich-blue hover:bg-umich-maize/80 flex items-center gap-2 font-bold"
      >
        <LogOutIcon />
        <span>Logout</span>
      </Button>
    </div>
  );
}
