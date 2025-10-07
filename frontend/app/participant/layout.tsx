import LogoutButton from "@/components/LogoutButton";

export default function ParticipantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between bg-muted px-6 py-3 shadow">
        <h1 className="text-lg font-bold">Participant Dashboard</h1>
        <LogoutButton />
      </header>

      {/* Main content area */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
