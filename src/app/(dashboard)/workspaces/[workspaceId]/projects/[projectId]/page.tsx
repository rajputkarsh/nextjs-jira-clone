import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import { headers } from "next/headers";

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
    const currentUrl = `${protocol}://${host}/workspaces/${params.workspaceId}`;
    const encodedCallbackUrl = encodeURIComponent(currentUrl);
    redirect(`/sign-in?callbackUrl=${encodedCallbackUrl}`);
  }
  
  return (
    <div>Project</div>
  )
}

export default Project;
