"use client";

import { User } from "@/lib/types/user";
import { useEffect, useState } from "react";
import { getUserColumnDef, getAdminColumnDef } from "./users/columns";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "../ui/spinner";
import { useAuth } from "../auth-provider";
import { RoleAction } from "./users/RoleDropdownCell";
import { useRouter } from "next/navigation";
import CustomTable from "../common/CustomTable";

export default function UserManagement() {
  const { user: loggedInUser, refresh } = useAuth();
  const [admins, setAdmins] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function fetchUsers() {
    try {
      const res = await fetch("/api/users", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.filter((user: User) => user.role === "USER"));
      setAdmins(data.filter((user: User) => user.role !== "USER"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const columnDefInputs = {
    isSuperadmin: loggedInUser?.role === "SUPERADMIN",
    onRoleAction: async (targetUserId: number, value: RoleAction) => {
      try {
        let newRole = "";
        if (value === "promote-to-admin") newRole = "ADMIN";
        else if (value === "demote-to-user") newRole = "USER";
        else if (value === "transfer-superadmin") newRole = "SUPERADMIN";
        else throw new Error("Invalid role action");

        const res = await fetch(
          `/api/proxy?path=/api/users/${targetUserId}/role?newRole=${newRole}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ role: value }),
          },
        );
        if (!res.ok) throw new Error("Failed to update user role");
        fetchUsers();

        // Log out current superadmin if transferring role
        if (value === "transfer-superadmin") {
          // Log out the current superadmin to invalidate their session
          const logoutRes = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });

          if (!logoutRes.ok) {
            throw new Error("Failed to log out current superadmin");
          }
          await refresh();
          router.refresh();
        }
      } catch (err) {
        console.error(err);
      }
    },
  };
  const userColumns = getUserColumnDef(columnDefInputs);
  const adminColumns = getAdminColumnDef(columnDefInputs);

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <Spinner className="size-24" />
      </div>
    );

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Admins</h2>
      <CustomTable columns={adminColumns} data={admins} />

      <Separator />

      <h2 className="text-2xl font-bold">Users</h2>
      <CustomTable columns={userColumns} data={users} />
    </section>
  );
}
