"use client";

import { User } from "@/lib/types/user";
import {
  formatToLongLocalStringWithTZ,
  localDateTimeArrayToUTCDate,
} from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { RoleAction, RoleDropdownCell } from "./RoleDropdownCell";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getUserColumnDef = ({
  isSuperadmin,
  onRoleAction,
}: {
  isSuperadmin: boolean;
  onRoleAction: (userId: number, action: RoleAction) => void;
}): ColumnDef<User>[] => [
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
    cell: ({ row }) => (
      <RoleDropdownCell
        target={row.original}
        isSuperadmin={isSuperadmin}
        onRoleAction={onRoleAction}
      />
    ),
  },
  {
    accessorKey: "enabled",
    header: "Enabled",
  },
];

export const getAdminColumnDef = ({
  isSuperadmin,
  onRoleAction,
}: {
  isSuperadmin: boolean;
  onRoleAction: (userId: number, action: RoleAction) => void;
}): ColumnDef<User>[] => [
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
    cell: ({ row }) => (
      <RoleDropdownCell
        target={row.original}
        isSuperadmin={isSuperadmin}
        onRoleAction={onRoleAction}
      />
    ),
  },
  {
    accessorKey: "enabled",
    header: "Enabled",
  },
];
