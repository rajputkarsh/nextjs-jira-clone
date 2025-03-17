"use client";

import { useTranslations } from "next-intl";
import PageLoader from "@/components/page-loader";
import PageError from "@/components/page-error";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { useGetWorkspaceAnalyticsById } from "@/features/workspaces/api/use-getWorkspaceAnalyticsById";
import { useGetProjects } from "@/features/projects/api/use-getProjects";
import { useGetMembers } from "@/features/members/api/use-getMembers";
import { useGetTasks } from "@/features/tasks/api/use-getTasks";
import Analytics from "@/components/analytics";
import TaskList from "@/features/tasks/components/TaskList";
import ProjectList from "@/features/projects/components/ProjectList";

function WorkspaceClient() {
  const translate = useTranslations("workspaces");
  const workspaceId = useWorkspaceId();

  const { data: workspaceAnalytics, isLoading: isLoadingWorkspaceAnalytics } =
    useGetWorkspaceAnalyticsById({ workspaceId });
  const { data: tasks, isLoading: isLoadingTasks } =
    useGetTasks({ workspaceId });
  const { data: projects, isLoading: isLoadingProjects } =
    useGetProjects({ workspaceId });
  const { data: members, isLoading: isLoadingMembers } =
    useGetMembers({ workspaceId });

  const isLoading =
    isLoadingWorkspaceAnalytics ||
    isLoadingTasks ||
    isLoadingProjects ||
    isLoadingMembers;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!workspaceAnalytics || !tasks || !projects || !members) {
    return <PageError message={translate("workspace_not_found")} />;
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <Analytics data={workspaceAnalytics} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList data={tasks.documents} total={tasks.total} />
        <ProjectList data={projects.documents} total={projects.total} />
      </div>
    </div>
  );
}

export default WorkspaceClient