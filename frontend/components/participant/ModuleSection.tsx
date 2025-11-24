"use client";
import { useEffect, useState } from "react";
import { Module } from "@/lib/types/module";
import ModuleWrapper from "../common/module/ModuleWrapper";
import ModuleProgressCircle from "./ModuleProgressCircle";

export default function ModuleSection() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selected, setSelected] = useState<Module | null>(null);

  // Fetch info for all modules when first time loading page
  useEffect(() => {
    const fetchModules = async () => {
      const res = await fetch("/api/modules", { credentials: "include" });
      if (res.ok) {
        const data: Module[] = await res.json();
        setModules(data);
        if (data.length > 0) setSelected(data[0]); // auto-select first
      }
    };

    fetchModules();
  }, []);

  return (
    <div className="flex gap-4">
      {/* Sidebar */}
      <div className="bg-muted sticky top-4 h-full w-64 overflow-y-auto rounded-lg border-r">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-semibold">Modules</h2>
        </div>
        <ul>
          {modules.map((m) => (
            <li
              key={m.id}
              onClick={() => setSelected(m)}
              className={`hover:bg-muted-foreground flex cursor-pointer items-center justify-between p-4 ${
                selected?.id === m.id ? "bg-muted-foreground font-bold" : ""
              }`}
            >
              {m.id}. {m.title}
              <ModuleProgressCircle moduleId={m.id} />
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="bg-secondary flex-1 overflow-y-auto rounded-lg p-4">
        {selected ? (
          <ModuleWrapper module={selected} />
        ) : (
          <p className="">Select a module from the sidebar</p>
        )}
      </div>
    </div>
  );
}
