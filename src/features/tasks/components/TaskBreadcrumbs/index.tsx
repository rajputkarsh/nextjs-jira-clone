"use client";

import { Button } from "@/components/ui/button";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";
import { Project } from "@/features/projects/types";
import { Task } from "@/features/tasks/schema";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { ChevronRightIcon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface TaskBreadcrumbsProps {
  project: Project;
  task: Task
}

function TaskBreadcrumbs({ project, task }: TaskBreadcrumbsProps) {
  const translate = useTranslations("TaskActions");
  const workspaceId = useWorkspaceId();

  return (
    <div className="flex items-center gap-x-2">
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
      <Button className="ml-auto" variant={"destructive"} size="sm">
        <TrashIcon className="size-4 lg:mr-2" />
        <span className="hidden lg:block">{translate("delete_task")}</span>
      </Button>
    </div>
  );
}

export default TaskBreadcrumbs;
