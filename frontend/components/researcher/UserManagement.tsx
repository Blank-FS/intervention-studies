"use client";
import { User } from "@/lib/types/user";
import { useEffect, useState } from "react";
import { getUserColumnDef, getAdminColumnDef } from "./users/columns";
import { Separator } from "@/components/ui/separator";
import UserTable from "./users/UserTable";
import { Spinner } from "../ui/spinner";

export default function UserManagement() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.filter((user: User) => user.role == "USER"));
        setAdmins(data.filter((user: User) => user.role != "USER"));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const userColumns = getUserColumnDef();
  const adminColumns = getAdminColumnDef();

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <Spinner className="size-24" />
      </div>
    );

  return (
    <section className="space-y-4 p-2">
      <h2 className="text-2xl font-bold">Admins</h2>
      <Separator />
      <UserTable columns={adminColumns} data={admins} />

      <Separator className="bg-white" />

      <h2 className="text-2xl font-bold">Users</h2>
      <Separator />
      <UserTable columns={userColumns} data={users} />
    </section>
  );
}
