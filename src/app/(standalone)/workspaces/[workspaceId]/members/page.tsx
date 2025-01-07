import { getCurrent } from "@/features/auth/queries";
import MembersList from "@/features/members/components/MembersList";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface WorkspaceMembersPageProps {
  params: {
    workspaceId: string;
    inviteCode: string;
  };
}

async function WorkspaceMembers({ params }: WorkspaceMembersPageProps) {
  const user = await getCurrent();
  if (!user) {
    const headersList = headers();
    const host = headersList.get("host") || "";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    // Construct the current URL
    const currentUrl = `${protocol}://${host}/workspaces/${params.workspaceId}/members`;
    const encodedCallbackUrl = encodeURIComponent(currentUrl);
    redirect(`/sign-in?callbackUrl=${encodedCallbackUrl}`);
  }
  
    const workspace = await getWorkspaceInfo({ workspaceId: params.workspaceId });
  
    if (!workspace) {
      redirect("/");
    }

  return (
    <div className="w-full lg:max-w-xl">
      <MembersList />
    </div>
  )
}

export default WorkspaceMembers