"use server";

import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID } from "@/config";
import { getMembers } from "@/features/members/types/utils";
import { Models, Query } from "node-appwrite";
import { Project } from "@/features/projects/types";
import { createSessionClient } from "@/lib/appwrite";

interface GetProjectProps {
  projectId: string;
}

export const getProjects = async (
  workspaceId: string
): Promise<Models.DocumentList<Models.Document>> => {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (!members.documents.length) {
      return { documents: [], total: 0 };
    }

    const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.orderDesc("$createdAt"),
    ]);

    return projects;
  } catch (e) {
    return { documents: [], total: 0 };
  }
};

export const getProject = async ({
  projectId,
}: GetProjectProps): Promise<Project | null> => {
  try {
    const { account, databases } = await createSessionClient();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    return project;
  } catch (e) {
    return null;
  }
};

export const getProjectInfo = async ({
  projectId,
}: GetProjectProps): Promise<{ name: string } | null> => {
  try {
    const { databases } = await createSessionClient();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    return { name: project.name };
  } catch (e) {
    return null;
  }
};