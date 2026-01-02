import FluStudyCard from "@/components/common/FluStudyCard";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <section className="flex h-full w-full flex-col gap-2">
      <h1 className="text-2xl font-bold">Studies</h1>
      <Separator />

      {/* List of Studies */}
      <div className="flex items-center gap-2">
        <FluStudyCard isAdmin={true} />
      </div>
    </section>
  );
}
