"use client";

import React, { useEffect, useState } from "react";
import CustomTable from "../common/CustomTable";
import { FluStudyResponse, getColumnDef } from "./flu-study/columns";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { DownloadIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { convertToCSV } from "@/lib/utils";

const FluStudySection = () => {
  const [responses, setResponses] = useState<FluStudyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchResponses() {
    try {
      const res = await fetch("/api/proxy?path=/api/flu-study", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch responses");
      const data: { responses: FluStudyResponse[] } = await res.json();
      setResponses(data.responses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchResponses();
  }, []);

  const responseColumns = getColumnDef(fetchResponses);

  function downloadCSV(csv: string, filename: string) {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const handleExport = () => {
    const csv = convertToCSV<FluStudyResponse>(responses);
    downloadCSV(csv, "flu-study-responses.csv");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <Spinner className="size-24" />
      </div>
    );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex h-8 items-center gap-4">
          <h2 className="text-2xl font-bold">Responses</h2>
          <Separator orientation="vertical" />
          <Badge variant="outline">Total Responses: {responses.length}</Badge>
        </div>
        <Button
          className="bg-umich-maize text-umich-blue hover:bg-umich-maize/80 flex items-center gap-2 font-bold"
          onClick={handleExport}
        >
          <DownloadIcon />
          <span>Export Data</span>
        </Button>
      </div>
      <CustomTable columns={responseColumns} data={responses} />
    </section>
  );
};

export default FluStudySection;
