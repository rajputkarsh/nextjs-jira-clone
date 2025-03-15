"use client";

import UpdateWorkSpaceForm from "@/features/workspaces/components/UpdateWorkspaceForm";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-getWorkspaceById";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import PageLoader from "@/components/page-loader";
import PageError from "@/components/page-error";
import { useTranslations } from "next-intl";

function WorkspaceSettingsClient() {
  const translate = useTranslations("Workspace");
  const workspaceId = useWorkspaceId();

  const { data: workspaceInfo, isLoading } = useGetWorkspaceById({
    workspaceId
  });

    if (isLoading) {
      return <PageLoader />;
    }

    if (!workspaceInfo) {
      return <PageError message={translate("workspace_not_found")} />;
    }

    console.log(`workspaceInfo -- `, workspaceInfo);

  return (
    <div className="w-full lg:max-w-xl">
      <UpdateWorkSpaceForm initialValues={workspaceInfo} />
    </div>
  );
}

export default WorkspaceSettingsClient;
