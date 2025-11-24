"use client";

import { useEffect, useState } from "react";
import ModuleCreateForm from "./actions/ModuleCreateForm";
import { Module } from "@/lib/types/module";
import ModuleWrapper from "@/components/common/module/ModuleWrapper";
import ModuleDeleteForm from "./actions/ModuleDeleteForm";

export default function ModuleManagement() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selected, setSelected] = useState<Module | null>(null);

  // Fetch info for all modules
  useEffect(() => {
    const fetchModules = async () => {
      const res = await fetch("/api/modules", { credentials: "include" });
      if (res.ok) {
        const data: Module[] = await res.json();
        setModules(data);
        if (data.length > 0) setSelected(data[0]); // Auto-select first module to populate main content
      }
    };

    fetchModules();
  }, []);

  const onModuleCreated = (newModule: Module) => {
    setModules((prev) => [...prev, newModule]);
    setSelected(newModule);
  };

  const onModuleDeleted = (deletedModuleId: number) => {
    setModules((prev) => prev.filter((m) => m.id !== deletedModuleId));
    if (selected?.id === deletedModuleId) setSelected(null);
  };

  return (
    <div className="flex items-start gap-4">
      {/* Sidebar */}
      <div className="bg-muted sticky top-4 h-full w-64 overflow-y-auto rounded-lg border-r">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-semibold">Modules</h2>
          <ModuleCreateForm onCreate={onModuleCreated} />
        </div>
        <ul>
          {modules.map((m, idx) => (
            <li
              key={m.id}
              onClick={() => setSelected(m)}
              className={`hover:bg-muted-foreground cursor-pointer p-4 ${
                selected?.id === m.id ? "bg-muted-foreground font-bold" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <p>
                  {idx + 1}. {m.title}
                </p>
                <div onClick={(e) => e.stopPropagation()}>
                  <ModuleDeleteForm
                    moduleId={m.id}
                    onDelete={onModuleDeleted}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="bg-secondary flex-1 overflow-y-auto rounded-lg p-4">
        {selected ? (
          <ModuleWrapper module={selected} editable />
        ) : (
          <p className="">Select a module from the sidebar</p>
        )}
      </div>
    </div>
  );
}
