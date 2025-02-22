import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useConfirm from "@/hooks/use-confirm";
import { useDeleteTask } from "@/features/tasks/api/use-deleteTask";

interface TaskActionsProps {
  id: string;
  projectId: string;
  children: ReactNode;
}

function TaskActions({ id, projectId, children }: TaskActionsProps) {
  const translations = useTranslations("TaskActions");
  
  const [DeleteDialog, confirmDelete] = useConfirm(
    translations("delete_task"),
    translations("this_action_cannot_be_undone"),
    "destructive"
  );
  const { mutate: deleteTask, isPending: isDeletingTask } = useDeleteTask();

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if(!ok) return null;

    deleteTask({param: { taskId: id }});
  }

  const isPending = isDeletingTask;

  return (
    <div className="flex justify-end">
      <DeleteDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            className="cursor-pointer font-medium p-[10px]"
            disabled={isPending}
            onClick={() => {}}
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            {translations("task_details")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer font-medium p-[10px]"
            disabled={isPending}
            onClick={() => {}}
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            {translations("open_project")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer font-medium p-[10px]"
            disabled={isPending}
            onClick={() => {}}
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            {translations("edit_task")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-amber-700 focus:text-amber-700 font-medium p-[10px]"
            disabled={isPending}
            onClick={handleDelete}
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
