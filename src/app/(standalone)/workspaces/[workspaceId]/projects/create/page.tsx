import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import CreateProjectForm from "@/features/projects/components/CreateProjectForm"
import { headers } from "next/headers";


interface CreateProjectProps {
  params: {
    workspaceId: string;
  };
}

async function CreateProject({ params: { workspaceId } }: CreateProjectProps) {
  const user = await getCurrent();
  if (!user) {
    const headersList = headers();
    const host = headersList.get("host") || "";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    // Construct the current URL
    const currentUrl = `${protocol}://${host}/workspaces/${workspaceId}/projects/create`;
    const encodedCallbackUrl = encodeURIComponent(currentUrl);
    redirect(`/sign-in?callbackUrl=${encodedCallbackUrl}`);
  }

  return (
    <div className="w-full lg:max-w-xl">
      <CreateProjectForm />
    </div>
  );
}

export default CreateProject