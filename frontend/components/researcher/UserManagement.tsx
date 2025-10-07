"use client";
import { useEffect, useState } from "react";

type User = {
  id: number;
  email: string;
  prolificId: string;
  role: string;
  enabled: boolean;
};

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

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <table className="table-auto border-collapse border w-full">
        <thead>
          <tr className="bg-muted text-white">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Prolific ID</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Enabled</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-muted-foreground">
              <td className="border px-4 py-2">{u.id}</td>
              <td className="border px-4 py-2">{u.email}</td>
              <td className="border px-4 py-2">{u.prolificId}</td>
              <td className="border px-4 py-2">{u.role}</td>
              <td className="border px-4 py-2">
                {u.enabled ? "True" : "False"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
