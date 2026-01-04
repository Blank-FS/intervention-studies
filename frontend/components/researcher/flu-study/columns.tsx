"use client";

import { ColumnDef } from "@tanstack/react-table";
import FluStudyData from "./FluStudyData";
import DeleteResponse from "./DeleteResponse";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type FluStudyResponse = {
  id: number;
  email: string;
  prolificId: string;
  age: number;
  valid: boolean;
  baselineVaxIntent: number;
  postVaxIntent: number;
};

export const getColumnDef = (
  refetchData: () => void,
): ColumnDef<FluStudyResponse>[] => [
  {
    accessorKey: "id",
    header: "User ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "prolificId",
    header: "Prolific ID",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "valid",
    header: "Valid",
  },
  {
    accessorKey: "baselineVaxIntent",
    header: "Baseline Vax Intent",
  },
  {
    accessorKey: "postVaxIntent",
    header: "Post Vax Intent",
  },
  {
    id: "completeResponse",
    header: "Complete Response",
    cell: ({ row }) => {
      const id = row.original.id;
      return <FluStudyData id={id} />;
    },
  },
  {
    id: "deleteResponse",
    header: "Delete Response",
    cell: ({ row }) => {
      const id = row.original.id;
      return <DeleteResponse id={id} onDelete={refetchData} />;
    },
  },
];
