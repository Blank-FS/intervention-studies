"use client";

import { useEffect, useState } from "react";
import ModuleForm from "./ModuleForm";

type Module = {
  id: number;
  title: string;
  paragraph: string;
  videoUrl: string;
  questions: { id: number; questionText: string }[];
};

export default function ModuleManagement() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selected, setSelected] = useState<Module | null>(null);

  const fetchModules = async () => {
    const res = await fetch("/api/modules", { credentials: "include" });
    if (res.ok) {
      const data: Module[] = await res.json();
      setModules(data);
      if (data.length > 0) setSelected(data[0]); // auto-select first
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <div className="flex h-[80vh] border rounded-lg shadow-sm overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-muted border-r overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold">Modules</h2>
          <ModuleForm />
        </div>
        <ul>
          {modules.map((m) => (
            <li
              key={m.id}
              onClick={() => setSelected(m)}
              className={`p-4 cursor-pointer hover:bg-muted-foreground ${
                selected?.id === m.id ? "bg-muted-foreground font-bold" : ""
              }`}
            >
              {m.id}. {m.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 overflow-y-auto bg-secondary">
        {selected ? (
          <div>
            <h3 className="text-2xl font-bold mb-2">{selected.title}</h3>
            <p className="mb-4">{selected.paragraph}</p>
            <video
              src={`/api/videos/${selected.videoUrl}`}
              controls
              className="w-full max-h-96 rounded mb-6"
            />
            <h4 className="text-lg font-semibold mb-2">Questions</h4>
            <ul className="list-disc list-inside space-y-1">
              {selected.questions?.map((q) => (
                <li key={q.id}>{q.questionText}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="">Select a module from the sidebar</p>
        )}
      </div>
    </div>
  );
}
