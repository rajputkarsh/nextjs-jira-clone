"use client";

import { useTranslations } from "next-intl";
import PageLoader from "@/components/page-loader";
import PageError from "@/components/page-error";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { useGetWorkspaceAnalyticsById } from "@/features/workspaces/api/use-getWorkspaceAnalyticsById";
import { useGetProjects } from "@/features/projects/api/use-getProjects";
import { useGetMembers } from "@/features/members/api/use-getMembers";
import { useGetTasks } from "@/features/tasks/api/use-getTasks";
import { useCreateProjectModal } from "@/features/projects/hooks/use-createProjectModal";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-createTaskModal";

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

  const { open: createProject } = useCreateProjectModal();
  const { open: createTask } = useCreateTaskModal();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!workspaceAnalytics || !tasks || !projects || !members) {
    return <PageError message={translate("workspace_not_found")} />;
  }

  return (
    <div>WorkspaceClient</div>
  )
}

export default WorkspaceClient