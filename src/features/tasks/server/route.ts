import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createTaskSchema } from "@/features/tasks/schema";
import { sessionMiddleware } from "@/middlewares/session";
import { getMembers } from "@/features/members/types/utils";
import { HTTP_STATUS } from "@/constants/api";
import { DATABASE_ID, TASKS_ID } from "@/config";
import { ID, Query } from "node-appwrite";

const app = new Hono()
  .post(
    '/',
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
        const user = c.get("user");
        const databases = c.get("databases");

        const {
          name,
          status,
          workspaceId,
          projectId,
          assigneeId,
          dueDate,
        } = c.req.valid("json");

        const member = await getMembers({ databases, workspaceId, userId: user.$id });

      if (!member) {
        return c.json(
          { error: HTTP_STATUS.UNAUTHORISED.MESSAGE },
          HTTP_STATUS.UNAUTHORISED.STATUS
        );
      }

      const highestPositionTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId),
          Query.orderDesc("position"),
          Query.limit(1),
        ]
      );

      const newPosition = (highestPositionTask.documents?.[0]?.position || 0) + 1000;

      const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          status,
          workspaceId,
          projectId,
          assigneeId,
          dueDate,
          position: newPosition
        }
      );

      return c.json({ data: task });
    }
  );

export default app;
