import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createWorklogSchema, getWorklogsSchema, Worklog } from "@/features/worklogs/schema";
import { sessionMiddleware } from "@/middlewares/session";
import { getMembers } from "@/features/members/types/utils";
import { HTTP_STATUS } from "@/constants/api";
import { DATABASE_ID, MEMBERS_ID, WORKLOGS_ID, TASKS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", getWorklogsSchema),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");

      const { taskId } = c.req.valid("query");

      // Get task to verify workspace access
      const task = await databases.getDocument(
        DATABASE_ID,
        TASKS_ID,
        taskId
      );

      const member = await getMembers({
        databases,
        workspaceId: task.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json(
          { error: HTTP_STATUS.UNAUTHORISED.MESSAGE },
          HTTP_STATUS.UNAUTHORISED.STATUS
        );
      }

      const worklogs = await databases.listDocuments<Worklog>(
        DATABASE_ID,
        WORKLOGS_ID,
        [Query.equal("taskId", taskId), Query.orderDesc("date")]
      );

      // Populate user info for each worklog
      const memberIds = worklogs.documents.map((w) => w.memberId);
      const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        memberIds.length > 0 ? [Query.contains("$id", memberIds)] : []
      );

      const populatedWorklogs = await Promise.all(
        worklogs.documents.map(async (worklog) => {
          const member = members.documents.find((m) => m.$id === worklog.memberId);
          if (!member) return worklog;

          const userData = await users.get(member.userId);
          return {
            ...worklog,
            member: {
              ...member,
              name: userData.name || userData.email,
              email: userData.email,
            },
          };
        })
      );

      return c.json({ data: { ...worklogs, documents: populatedWorklogs } });
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createWorklogSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { taskId, workspaceId, efforts, date, description } = c.req.valid("json");

      // Get task to verify workspace access
      const task = await databases.getDocument(
        DATABASE_ID,
        TASKS_ID,
        taskId
      );

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

      const worklog = await databases.createDocument(
        DATABASE_ID,
        WORKLOGS_ID,
        ID.unique(),
        {
          taskId,
          workspaceId,
          userId: user.$id,
          memberId: member.$id,
          efforts,
          date: date.toISOString(),
          description: description || "",
        }
      );

      return c.json({ data: worklog });
    }
  );

export default app;
