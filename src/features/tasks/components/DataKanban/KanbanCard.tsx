import TaskActions from "@/features/tasks/components/TaskActions";
import { ITask } from "@/features/tasks/schema";
import { MoreHorizontalIcon } from "lucide-react";

interface KanbanCardProps {
  task: ITask
}

function KanbanCard({ task }: KanbanCardProps) {
  return (
    <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-x-2">
        <p className="text-sm line-clamp-2">{task.name}</p>
        <TaskActions id={task.$id as string} projectId={task.projectId}>
          <MoreHorizontalIcon className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
        </TaskActions>
      </div>
    </div>
  );
}

export default KanbanCard