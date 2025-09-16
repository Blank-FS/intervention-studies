// app/researcher/page.tsx
import LogoutButton from "@/components/LogoutButton";

export default async function ResearcherPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl">Researcher Dashboard</h1>
      <LogoutButton />
    </div>
  );
}
