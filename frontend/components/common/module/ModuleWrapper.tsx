"use client";

import React from "react";
import EditableModule from "./EditableModule";
import InteractiveModule from "./InteractiveModule";
import { Module } from "@/types/definition";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ModuleWrapper = ({
  module,
  editable = false,
}: {
  module: Module;
  editable?: boolean;
}) => {
  // Toggle mode logic
  const [editMode, setEditMode] = React.useState(true);
  const toggleEditMode = () => setEditMode((prev) => !prev);
  const ToggleComponent = () => {
    return editable ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={toggleEditMode}>
            {editMode ? <Eye /> : <Pencil />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{editMode ? "Switch to Preview Mode" : "Switch to Edit Mode"}</p>
        </TooltipContent>
      </Tooltip>
    ) : null;
  };

  // Participant view
  if (!editable)
    return (
      <InteractiveModule module={module} ToggleComponent={ToggleComponent} />
    );

  // Researcher view
  return editMode ? (
    <EditableModule module={module} ToggleComponent={ToggleComponent} />
  ) : (
    <InteractiveModule
      module={module}
      ToggleComponent={ToggleComponent}
      preview
    />
  );
};

export default ModuleWrapper;
