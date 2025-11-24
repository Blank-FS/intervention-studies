"use client";

import { User } from "@/lib/types/user";
import {
  formatToLongLocalStringWithTZ,
  localDateTimeArrayToUTCDate,
} from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getColumnDef = (): ColumnDef<User>[] => [
  {
    accessorKey: "id",
    header: "User ID",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ getValue }) => {
      const date = localDateTimeArrayToUTCDate(getValue<number[]>());
      return formatToLongLocalStringWithTZ(date);
    },
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
];
