import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import { headers } from "next/headers";
import ProjectSettingsClient from "./client";

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

  return <ProjectSettingsClient />
}

export default ProjectSettings;
