import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskActionsProps {
  id: string;
  projectId: string;
  children: ReactNode;
}

function TaskActions({ id, projectId, children }: TaskActionsProps) {
  const translations = useTranslations("TaskActions");
  return (
    <div className="flex justify-end">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            className="font-medium p-[10px]"
            disabled={false}
            onClick={() => {}}
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            {translations("task_details")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="font-medium p-[10px]"
            disabled={false}
            onClick={() => {}}
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            {translations("open_project")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="font-medium p-[10px]"
            disabled={false}
            onClick={() => {}}
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            {translations("edit_task")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
            disabled={false}
            onClick={() => {}}
          >
            <TrashIcon className="size-4 mr-2 stroke-2" />
            {translations("delete_task")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default TaskActions;
