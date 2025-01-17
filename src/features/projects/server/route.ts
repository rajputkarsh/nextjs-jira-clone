import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { HTTP_STATUS } from "@/constants/api";
import { getMembers } from "@/features/members/types/utils";
import { sessionMiddleware } from "@/middlewares/session";
import { getProjectsListSchema } from "@/features/projects/schema";
import { Hono } from "hono";
import { Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

const app = new Hono().get(
  "/",
  sessionMiddleware,
  zValidator("query", getProjectsListSchema),
  async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { workspaceId } = c.req.valid("query");

    const member = await getMembers({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json(
        { error: HTTP_STATUS.UNAUTHORISED.MESSAGE },
        HTTP_STATUS.UNAUTHORISED.STATUS
      );
    }

    const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.orderDesc("$createdAt"),
    ]);

    return c.json({
      data: projects,
    });
  }
);
export default app;
