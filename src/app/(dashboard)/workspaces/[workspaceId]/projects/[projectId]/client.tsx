"use client";

import ProjectAvatar from "@/features/projects/components/ProjectAvatar";
import EditProjectButton from "@/features/projects/components/EditProjectButton";
import TaskViewSwitcher from "@/features/tasks/components/TaskViewSwitcher";
import { useProjectId } from "@/features/workspaces/hooks/use-projectId";
import { useGetProjectById } from "@/features/projects/api/use-getProjectById";
import { useTranslations } from "next-intl";
import PageLoader from "@/components/page-loader";
import PageError from "@/components/page-error";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";

function ProjectClient() {
  const translate = useTranslations("projects");
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();
  const { data: projectInfo, isLoading } = useGetProjectById({ projectId });

    if (isLoading) {
      return <PageLoader />;
    }

    if (!projectInfo) {
      return <PageError message={translate("project_not_found")} />;
    }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={projectInfo.name}
            image={projectInfo?.imageUrl}
            className="size-8"
          />
          <p className="text-xl font-semibold">{projectInfo.name}</p>
        </div>
        <div>
          <EditProjectButton
            workspaceId={workspaceId}
            projectId={projectId}
          />
        </div>
      </div>
      <TaskViewSwitcher
        hideProjectFilter={true}
        initialProjectId={projectId}
      />
    </div>
  );
}

export default ProjectClient