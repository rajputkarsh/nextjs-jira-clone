"use server";

import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { AUTH_COOKIE } from "@/constants/api";
import { cookies } from "next/headers";
import { Account, Client, Databases, Models, Query } from "node-appwrite";

export const getWorkspaces = async (): Promise<
  Models.DocumentList<Models.Document>
> => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = await cookies();
    const authCookie = session.get(AUTH_COOKIE)?.value;

    if (!authCookie) return { documents: [], total: 0 };

    client.setSession(authCookie);

    const databases = new Databases(client);
    const account = new Account(client);

    const user = await account.get();

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (!members.documents.length) {
      return { documents: [], total: 0 };
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.contains("$id", workspaceIds), Query.orderDesc("$createdAt")]
    );

    return workspaces;
  } catch (e) {
    return { documents: [], total: 0 };
  }
};
