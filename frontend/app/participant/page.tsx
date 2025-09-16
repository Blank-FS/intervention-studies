// app/participant/page.tsx
import LogoutButton from "@/components/LogoutButton";

export default async function ParticipantPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl">Participant Dashboard</h1>
      <LogoutButton />
    </div>
  );
}
