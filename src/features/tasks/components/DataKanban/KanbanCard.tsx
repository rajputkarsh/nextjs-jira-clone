import { DottedSeparator } from "@/components/dotter-separator";
import MemberAvatar from "@/features/members/components/MemberAvatar";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";
import TaskActions from "@/features/tasks/components/TaskActions";
import TaskDate from "@/features/tasks/components/TaskDate";
import { ITask, Task } from "@/features/tasks/schema";
import { MoreHorizontalIcon } from "lucide-react";

interface KanbanCardProps {
  task: ITask;
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
      <DottedSeparator />
      <div className="flex items-center gap-x-1.5">
        <MemberAvatar
          name={(task as Task)?.assignee?.name}
          fallbackClassName="text-[10px]"
        />
        <div className="size-1 rounded-full bg-neutral-300" />
        <TaskDate value={task.dueDate} className="text-xs" />
      </div>
      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar
          name={(task as Task)?.project?.name}
          image={(task as Task)?.project?.imageUrl}
          fallbackClassName="text-[10px]"
        />
        <span className="text-xs font-medium">
          {(task as Task)?.project?.name}
        </span>
      </div>
    </div>
  );
}

export default KanbanCard;
