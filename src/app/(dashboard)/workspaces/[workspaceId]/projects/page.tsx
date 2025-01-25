import { getCurrent } from "@/features/auth/queries";
import { getProjects } from "@/features/projects/queries";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface ProjectProps {
  params: {
    workspaceId: string;
    projectId: string
  };
}

export default async function Projects({ params: { workspaceId, projectId } }: ProjectProps) {
  const user = await getCurrent();
  if (!user) {
    const headersList = headers();
    const host = headersList.get("host") || "";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    // Construct the current URL
    const currentUrl = `${protocol}://${host}/projects`;
    const encodedCallbackUrl = encodeURIComponent(currentUrl);
    redirect(`/sign-in?callbackUrl=${encodedCallbackUrl}`);
  }

  const projects = await getProjects(workspaceId);

  if (projects.total === 0) {
    redirect(`/workspaces/${workspaceId}/projects/create`);
  } else {
    redirect(
      `/workspaces/${workspaceId}/projects/${projects.documents?.[0]?.$id}`
    );
  }
}
