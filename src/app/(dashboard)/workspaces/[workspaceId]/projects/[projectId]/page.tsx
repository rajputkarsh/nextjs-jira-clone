import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import { headers } from "next/headers";
import { getProject } from "@/features/projects/queries";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";
import EditProjectButton from "@/features/projects/components/EditProjectButton";
import TaskViewSwitcher from "@/features/tasks/components/TaskViewSwitcher";

interface ProjectProps {
  params: {
    workspaceId: string;
    projectId: string;
  };
}

async function Project({ params }: ProjectProps) {
  const user = await getCurrent();
  if (!user) {
    const headersList = headers();
    const host = headersList.get("host") || "";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    // Construct the current URL
    const currentUrl = `${protocol}://${host}/workspaces/${params.workspaceId}/projects/${params.projectId}`;
    const encodedCallbackUrl = encodeURIComponent(currentUrl);
    redirect(`/sign-in?callbackUrl=${encodedCallbackUrl}`);
  }

  const projectInfo = await getProject({ projectId: params.projectId });

  if (!projectInfo) {
    redirect(`/workspaces/${params.workspaceId}`);
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
            workspaceId={params.workspaceId}
            projectId={params.projectId}
          />
        </div>
      </div>
      <TaskViewSwitcher hideProjectFilter={true} initialProjectId={params.projectId} />
    </div>
  );
}

export default Project;
