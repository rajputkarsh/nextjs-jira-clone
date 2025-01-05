import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import UpdateWorkSpaceForm from "@/features/workspaces/components/UpdateWorkspaceForm";
import { getWorkspace } from "@/features/workspaces/queries";
import { headers } from "next/headers";

interface WorkspaceSettingsProps {
  params: {
    workspaceId: string
  }
}

async function WorkspaceSettings({ params }: WorkspaceSettingsProps) {

  const user = await getCurrent();
  if (!user) {
    const headersList = headers();
    const host = headersList.get("host") || "";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    // Construct the current URL
    const currentUrl = `${protocol}://${host}/workspaces/${params.workspaceId}/settings`;
    const encodedCallbackUrl = encodeURIComponent(currentUrl);
    redirect(`/sign-in?callbackUrl=${encodedCallbackUrl}`);
  }

  const initialValues = await getWorkspace({ workspaceId: params.workspaceId });

  if (!initialValues) {
    redirect(`/workspaces/${params.workspaceId}`);
  }

  return (
    <div className="w-full lg:max-w-xl">
      <UpdateWorkSpaceForm initialValues={initialValues} />
    </div>
  );
}

export default WorkspaceSettings