"use server";

import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { getMembers } from "@/features/members/types/utils";
import { Models, Query } from "node-appwrite";
import { Workspace } from "@/features/workspaces/types";
import { createSessionClient } from "@/lib/appwrite";

interface GetWorkspaceProps {
  workspaceId: string;
}

export const getWorkspaces = async (): Promise<
  Models.DocumentList<Models.Document>
> => {
  try {
    const { account, databases } = await createSessionClient();

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



export const getWorkspace = async ({
  workspaceId,
}: GetWorkspaceProps): Promise<Workspace | null> => {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const member = await getMembers({ databases, workspaceId, userId: user.$id })

    if(!member) {
      return null;
    }

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return workspace;
  } catch (e) {
    return null;
  }
};