"use client";

import { User } from "@/lib/types/user";
import {
  formatToLongLocalStringWithTZ,
  localDateTimeArrayToUTCDate,
} from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import FluStudyData from "./FluStudyData";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getUserColumnDef = (): ColumnDef<User>[] => [
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
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "enabled",
    header: "Enabled",
  },
  {
    accessorKey: "studyData",
    header: "Study Data",
    cell: ({ row }) => {
      const id = row.original.id;
      return <FluStudyData id={id} />;
    },
  },
];

export const getAdminColumnDef = (): ColumnDef<User>[] => [
  {
    accessorKey: "id",
    header: "User ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "enabled",
    header: "Enabled",
  },
];
