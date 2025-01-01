import { Query, type Databases, type Models } from "node-appwrite";
import { DATABASE_ID, MEMBERS_ID } from '@/config';

interface GetMemberProps {
  databases: Databases;
  workspaceId: string;
  userId: string;
}

export const getMembers = async ({ databases, workspaceId, userId }: GetMemberProps): Promise<Models.Document> => {
  const members = await databases.listDocuments(
    DATABASE_ID,
    MEMBERS_ID,
    [
      Query.equal("workspaceId", workspaceId),
      Query.equal("userId", userId),
    ]
  );

  return members.documents?.[0];
}