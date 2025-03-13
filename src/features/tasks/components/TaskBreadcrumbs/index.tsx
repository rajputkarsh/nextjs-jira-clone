"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useDeleteTask } from "@/features/tasks/api/use-deleteTask";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";
import { ChevronRightIcon, TrashIcon } from "lucide-react";
import { Project } from "@/features/projects/types";
import { Button } from "@/components/ui/button";
import { Task } from "@/features/tasks/schema";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import useConfirm from "@/hooks/use-confirm";

interface TaskBreadcrumbsProps {
  project: Project;
  task: Task;
}

function TaskBreadcrumbs({ project, task }: TaskBreadcrumbsProps) {
  const translate = useTranslations("TaskActions");
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { mutate: deleteTask, isPending } = useDeleteTask();
  const [ConfirmDialog, confirm] = useConfirm(
    translate("delete_task"),
    translate("this_action_cannot_be_undone"),
    "destructive"
  );

  const handleDelete = async () => {

    const ok = await confirm();
    if (!ok) return;

    deleteTask({ param: { taskId: task.$id } }, {
      onSuccess: () => {
        router.push(`/workspaces/${workspaceId}/tasks`);
      }
    });
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <ProjectAvatar
        name={project?.name}
        image={project?.imageUrl}
        className="size-6 lg:size-8"
      />
      <Link href={`/workspaces/${workspaceId}/projects/${project?.$id}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project?.name}
        </p>
      </Link>
      <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">{task?.name}</p>
      <Button
        onClick={handleDelete}
        disabled={isPending}
        className="ml-auto"
        variant={"destructive"}
        size="sm"
      >
        <TrashIcon className="size-4 lg:mr-2" />
        <span className="hidden lg:block">{translate("delete_task")}</span>
      </Button>
    </div>
  );
}

export default TaskBreadcrumbs;
