import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import UpdateProjectForm from "@/features/projects/components/UpdateProjectForm";
import { getProject } from "@/features/projects/queries";
import { headers } from "next/headers";

interface ProjectSettingsProps {
  params: {
    workspaceId: string
    projectId: string
  }
}

async function ProjectSettings({ params }: ProjectSettingsProps) {

  const user = await getCurrent();
  if (!user) {
    const headersList = headers();
    const host = headersList.get("host") || "";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    // Construct the current URL
    const currentUrl = `${protocol}://${host}/workspaces/${params.workspaceId}/projects/${params.projectId}/settings`;
    const encodedCallbackUrl = encodeURIComponent(currentUrl);
    redirect(`/sign-in?callbackUrl=${encodedCallbackUrl}`);
  }

  const initialValues = await getProject({ projectId: params.projectId });

  if (!initialValues) {
    redirect(`/workspaces/${params.workspaceId}/projects/${params.projectId}`);
  }

  return (
    <div className="w-full lg:max-w-xl">
      <UpdateProjectForm initialValues={initialValues} />
    </div>
  );
}

export default ProjectSettings;
