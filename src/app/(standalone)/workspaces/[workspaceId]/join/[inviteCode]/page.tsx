import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCurrent } from "@/features/auth/queries";
import WorkspaceInviteCodeClient from "./client";

interface JoinWorkspaceProps {
  params: {
    workspaceId: string;
    inviteCode: string;
  };
}

async function JoinWorkspace({ params }: JoinWorkspaceProps) {
  const user = await getCurrent();
  if (!user) {
    const headersList = headers();
    const host = headersList.get("host") || "";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    // Construct the current URL
    const currentUrl = `${protocol}://${host}/workspaces/${params.workspaceId}/join/${params.inviteCode}`;
    const encodedCallbackUrl = encodeURIComponent(currentUrl);
    redirect(`/sign-in?callbackUrl=${encodedCallbackUrl}`);
  }

  return (
    <WorkspaceInviteCodeClient />
  );
}

export default JoinWorkspace;
