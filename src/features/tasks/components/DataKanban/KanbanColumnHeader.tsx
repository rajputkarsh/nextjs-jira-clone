import { ReactNode } from "react";
import { TASK_STATUS } from "@/features/tasks/constants";
import {
  PlusIcon,
  CircleIcon,
  CircleDotIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
} from "lucide-react";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-createTaskModal";

const statusIconMap: Record<TASK_STATUS, ReactNode> = {
  [TASK_STATUS.BACKLOG]: (
    <CircleDashedIcon className="size-[18px] text-pink-400" />
  ),
  [TASK_STATUS.TODO]: <CircleIcon className="size-[18px] text-red-400" />,
  [TASK_STATUS.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size-[18px] text-yellow-400" />
  ),
  [TASK_STATUS.IN_REVIEW]: (
    <CircleDotIcon className="size-[18px] text-blue-400" />
  ),
  [TASK_STATUS.DONE]: (
    <CircleCheckIcon className="size-[18px] text-emerald-400" />
  ),
};

interface KanbanColumnHeaderProps {
  board: TASK_STATUS;
  taskCount: number;
}

function KanbanColumnHeader({ board, taskCount }: KanbanColumnHeaderProps) {
  const { open } = useCreateTaskModal();
  const icon = statusIconMap[board];

  return (
    <div className="px-2 py-1.5 flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium">
          {taskCount}
        </div>
      </div>
      <Button variant={"ghost"} size={"icon"} className="size-5" onClick={open}>
        <PlusIcon className="size-4 text-neutral-500" />
      </Button>
    </div>
  );
}

export default KanbanColumnHeader;
