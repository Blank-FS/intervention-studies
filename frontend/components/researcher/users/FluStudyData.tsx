import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Download } from "lucide-react";
import React, { useEffect, useState } from "react";

const FluStudyData = ({ id }: { id: number }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<string>("");

  useEffect(() => {
    // Fetch and handle flu study data for user with the given id
    async function fetchFluStudyData() {
      try {
        const res = await fetch(
          `/api/proxy?path=/api/flu-study/data?id=${id}`,
          {
            credentials: "include",
          },
        );
        if (!res.ok) {
          throw new Error("Failed to fetch flu study data");
        }
        const data: { message: string; studyData: string } = await res.json();
        setData(data.studyData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchFluStudyData();
  }, [id]);

  const onDownload = () => {
    const blob = new Blob([data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `flu_study_user_${id}_data.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="ml-8 py-2">
        <Spinner />
      </div>
    );
  }

  if (!data) {
    return <div className="py-2">N/A</div>;
  }

  return (
    <Button variant="outline" onClick={onDownload}>
      <Download className="size-4" />
    </Button>
  );
};

export default FluStudyData;
