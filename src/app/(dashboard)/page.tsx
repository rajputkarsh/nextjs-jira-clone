import { getCurrent } from "@/features/auth/queries";
import { getWorkspaces } from "@/features/workspaces/queries";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrent();
  if (!user) {
    const headersList = headers();
    const host = headersList.get("host") || "";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    // Construct the current URL
    const currentUrl = `${protocol}://${host}`;
    const encodedCallbackUrl = encodeURIComponent(currentUrl);
    redirect(`/sign-in?callbackUrl=${encodedCallbackUrl}`);
  }

  const workspaces = await getWorkspaces();

  if (workspaces.total === 0) {
    redirect('/workspaces/create');
  } else {
    redirect(`/workspaces/${workspaces.documents?.[0]?.$id}`);
  }

}
