import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import CreateWorkSpaceForm from "@/features/workspaces/components/CreateWorkspaceForm"

async function CreateWorkspace() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkSpaceForm />
    </div>
  )
}

export default CreateWorkspace