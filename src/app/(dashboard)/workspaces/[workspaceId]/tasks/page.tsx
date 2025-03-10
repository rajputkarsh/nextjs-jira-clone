import { getCurrent } from "@/features/auth/queries";
import TaskViewSwitcher from "@/features/tasks/components/TaskViewSwitcher";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface TaskProps {
  params: {
    workspaceId: string;
  };
}

export default async function Tasks({ params: { workspaceId } }: TaskProps) {
  const user = await getCurrent();
  if (!user) {
    const headersList = headers();
    const host = headersList.get("host") || "";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    // Construct the current URL
    const currentUrl = `${protocol}://${host}/workspaces/${workspaceId}/tasks`;
    const encodedCallbackUrl = encodeURIComponent(currentUrl);
    redirect(`/sign-in?callbackUrl=${encodedCallbackUrl}`);
  }

  return <TaskViewSwitcher />;
}
