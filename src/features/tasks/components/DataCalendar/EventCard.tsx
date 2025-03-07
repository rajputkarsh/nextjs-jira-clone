import { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import MemberAvatar from "@/features/members/components/MemberAvatar";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";
import { cn } from "@/lib/utils";
import { Project } from "@/features/projects/types";
import { TASK_STATUS } from "@/features/tasks/constants";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";

interface EventCardProps {
  id: string;
  title: string;
  assignee: any;
  project: Project;
  status: TASK_STATUS;
}

const STATUS_COLOR_MAP: Record<TASK_STATUS, string> = {
  [TASK_STATUS.BACKLOG]: "border-l-pink-500",
  [TASK_STATUS.TODO]: "border-l-red-500",
  [TASK_STATUS.IN_PROGRESS]: "border-l-yellow-500",
  [TASK_STATUS.IN_REVIEW]: "border-l-blue-500",
  [TASK_STATUS.DONE]: "border-l-emerald-500",
};

function EventCard({ id, title, assignee, project, status }: EventCardProps) {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  return (
    <div className="px-2">
      <div
        className={cn(
          "p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition",
          STATUS_COLOR_MAP[status]
        )}
        onClick={onClick}
      >
        <p>{title}</p>
        <div className="flex items-center gap-x-1">
          <MemberAvatar name={assignee?.name} />
          <div className="size-1 rounded-full bg-neutral-300" />
          <ProjectAvatar name={project?.name} image={project?.imageUrl} />
        </div>
      </div>
    </div>
  );
}

export default EventCard;
