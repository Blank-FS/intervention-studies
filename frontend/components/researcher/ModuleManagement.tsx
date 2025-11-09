"use client";

import { useEffect, useState } from "react";
import ModuleForm from "./ModuleForm";
import { Module } from "@/types/definition";
import ModuleWrapper from "../common/module/ModuleWrapper";

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

  return (
    <div className="flex gap-4">
      {/* Sidebar */}
      <Sidebar
        modules={modules}
        selected={selected}
        setSelected={setSelected}
      />

      {/* Main content */}
      <MainContent selected={selected} />
    </div>
  );
}

// Sidebar component
function Sidebar({
  modules,
  selected,
  setSelected,
}: {
  modules: Module[];
  selected: Module | null;
  setSelected: (module: Module) => void;
}) {
  return (
    <div className="w-64 bg-muted border-r overflow-y-auto sticky top-4 h-full rounded-lg">
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
  );
}

// Main content component
function MainContent({ selected }: { selected: Module | null }) {
  return (
    <div className="flex-1 p-4 overflow-y-auto bg-secondary rounded-lg">
      {selected ? (
        <ModuleWrapper module={selected} editable />
      ) : (
        <p className="">Select a module from the sidebar</p>
      )}
    </div>
  );
}
