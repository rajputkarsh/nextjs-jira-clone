import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import { getWorkspaceInfo } from "@/features/workspaces/queries";

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

  return (
    <div className="w-full lg:max-w-xl">
      Join Workspace
    </div>
  );
}

export default JoinWorkspace;
