import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/lib/types/user";
import { ChevronDown } from "lucide-react";

export type RoleAction =
  | "promote-to-admin"
  | "demote-to-user"
  | "transfer-superadmin";

const getRoleActions = (target: User, isSuperadmin: boolean): RoleAction[] => {
  if (!isSuperadmin) return [];

  if (target.role === "USER") {
    return ["promote-to-admin"];
  }

  if (target.role === "ADMIN") {
    return ["demote-to-user", "transfer-superadmin"];
  }

  // superadmin row → no actions
  return [];
};

type RoleDropdownCellProps = {
  target: User;
  isSuperadmin: boolean;
  onRoleAction: (userId: number, action: RoleAction) => void;
};

export function RoleDropdownCell({
  target,
  isSuperadmin,
  onRoleAction,
}: RoleDropdownCellProps) {
  const actions = getRoleActions(target, isSuperadmin);

  // Read-only
  if (!isSuperadmin || actions.length === 0) {
    return <span className="capitalize">{target.role}</span>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={
            "hover:bg-umich-blue/70 dark:hover:bg-umich-blue/70 hover:text-umich-maize border"
          }
        >
          {target.role}
          <ChevronDown className="ml-2 size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="bg-umich-blue text-umich-maize"
      >
        {actions.includes("promote-to-admin") && (
          <DropdownMenuItem
            onClick={() => onRoleAction(target.id, "promote-to-admin")}
            className="hover:bg-umich-maize hover:text-umich-blue dark:hover:bg-umich-maize dark:hover:text-umich-blue"
          >
            Promote to admin
          </DropdownMenuItem>
        )}

        {actions.includes("demote-to-user") && (
          <DropdownMenuItem
            onClick={() => onRoleAction(target.id, "demote-to-user")}
            className="hover:bg-umich-maize hover:text-umich-blue dark:hover:bg-umich-maize dark:hover:text-umich-blue"
          >
            Demote to user
          </DropdownMenuItem>
        )}

        {actions.includes("transfer-superadmin") && (
          <DropdownMenuItem
            className="text-destructive hover:bg-umich-maize hover:text-destructive dark:hover:bg-umich-maize dark:hover:text-destructive"
            onClick={() => onRoleAction(target.id, "transfer-superadmin")}
          >
            Transfer superadmin
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
