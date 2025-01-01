import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/actions";
import UpdateWorkSpaceForm from "@/features/workspaces/components/UpdateWorkspaceForm";
import { getWorkspace } from "@/features/workspaces/actions";

interface WorkspaceSettingsProps {
  params: {
    workspaceId: string
  }
}

async function WorkspaceSettings({ params }: WorkspaceSettingsProps) {

  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const initialValues = await getWorkspace({ workspaceId: params.workspaceId });

  if (!initialValues) {
    redirect(`/workspaces/${params.workspaceId}`);
  }

  return (
    <div>
      <UpdateWorkSpaceForm initialValues={initialValues} />
    </div>
  );
}

export default WorkspaceSettings