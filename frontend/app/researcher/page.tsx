"use client";

import { useState } from "react";
import UserManagement from "@/components/researcher/UserManagement";
import ModuleManagement from "@/components/researcher/ModuleManagement";

export default function ResearcherPage() {
  const [activeTab, setActiveTab] = useState<"users" | "modules">("users");

  return (
    <div>
      {/* Tab Controls */}
      <div className="flex">
        <button
          className={`px-4 py-2 rounded-tl w-36 ${
            activeTab === "users" ? "bg-muted-foreground" : "bg-muted"
          }`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={`px-4 py-2 rounded-tr w-36 ${
            activeTab === "modules" ? "bg-muted-foreground" : "bg-muted"
          }`}
          onClick={() => setActiveTab("modules")}
        >
          Modules
        </button>
      </div>

      {/* Tab Content */}
      <div className="border-t border-white py-4">
        {activeTab === "users" && <UserManagement />}
        {activeTab === "modules" && <ModuleManagement />}
      </div>
    </div>
  );
}
