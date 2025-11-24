"use client";
import { User } from "@/lib/types/user";
import { useEffect, useState } from "react";
import { getColumnDef } from "./users/columns";
import { Separator } from "@/components/ui/separator";
import UserTable from "./users/UserTable";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const columns = getColumnDef();

  if (loading) return <p>Loading users...</p>;

  return (
    <section>
      <UserTable columns={columns} data={users} />
    </section>
  );
}
