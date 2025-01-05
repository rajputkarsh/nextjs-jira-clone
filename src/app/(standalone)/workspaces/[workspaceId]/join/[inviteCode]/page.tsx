import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import JoinWorkspaceForm from "@/features/workspaces/components/JoinWorkspaceForm";

interface JoinWorkspaceProps {
  params: {
    workspaceId: string;
    inviteCode: string;
  };
}

async function JoinWorkspace({ params }: JoinWorkspaceProps) {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const workspace = await getWorkspaceInfo({ workspaceId: params.workspaceId });

  if (!workspace) {
    redirect('/');
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={workspace} />
    </div>
  );
}

export default JoinWorkspace;
