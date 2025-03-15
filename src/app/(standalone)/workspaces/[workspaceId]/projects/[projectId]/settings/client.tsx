"use client";

import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { useGetProjectById } from "@/features/projects/api/use-getProjectById";
import UpdateProjectForm from "@/features/projects/components/UpdateProjectForm";
import { useProjectId } from "@/features/workspaces/hooks/use-projectId";
import { useTranslations } from "next-intl";

function ProjectSettingsClient() {
  const translate = useTranslations("projects");
  const projectId = useProjectId();
  const { data: projectInfo, isLoading } = useGetProjectById({ projectId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!projectInfo) {
    return <PageError message={translate("project_not_found")} />;
  }


  return (
    <div className="w-full lg:max-w-xl">
      <UpdateProjectForm initialValues={projectInfo} />
    </div>
  );
}

export default ProjectSettingsClient