import { getCurrent } from "@/features/auth/queries";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import TaskClientPage from "./client";

interface TaskProps {
  params: {
    workspaceId: string;
    taskId: string;
  };
}

export default async function Tasks({ params: { workspaceId, taskId } }: TaskProps) {
  const user = await getCurrent();
  if (!user) {
    const headersList = headers();
    const host = headersList.get("host") || "";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    // Construct the current URL
    const currentUrl = `${protocol}://${host}/workspaces/${workspaceId}/tasks/${taskId}`;
    const encodedCallbackUrl = encodeURIComponent(currentUrl);
    redirect(`/sign-in?callbackUrl=${encodedCallbackUrl}`);
  }

  return (
    <TaskClientPage />
  );

}
