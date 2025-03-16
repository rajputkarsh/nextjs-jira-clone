"use client";

import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { useGetWorkspaceByIdInfo } from "@/features/workspaces/api/use-getWorkspaceByIdInfo";
import JoinWorkspaceForm from "@/features/workspaces/components/JoinWorkspaceForm";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { useTranslations } from "next-intl";

function WorkspaceInviteCodeClient() {
  const translate = useTranslations("Workspace");
  const workspaceId = useWorkspaceId();

  const { data: workspaceInfo, isLoading } = useGetWorkspaceByIdInfo({
    workspaceId,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!workspaceInfo) {
    return <PageError message={translate("workspace_not_found")} />;
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={workspaceInfo} />
    </div>
  );
}

export default WorkspaceInviteCodeClient