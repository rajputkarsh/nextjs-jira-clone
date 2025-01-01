import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";

async function Workspace() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  
  return (
    <div>Workspace</div>
  )
}

export default Workspace