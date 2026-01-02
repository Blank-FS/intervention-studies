import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import React from "react";

const FluStudyData = ({ id }: { id: number }) => {
  async function fetchFluStudyData(): Promise<string> {
    const res = await fetch(`/api/proxy?path=/api/flu-study/data?id=${id}`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch flu study data");
    }

    const data: { message: string; studyData: string } = await res.json();
    return data.studyData;
  }

  const onDownload = async () => {
    try {
      const studyData = await fetchFluStudyData();

      const blob = new Blob([studyData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `flu_study_user_${id}_data.csv`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Button variant="outline" onClick={onDownload}>
      <Download className="size-4" />
    </Button>
  );
};

export default FluStudyData;
