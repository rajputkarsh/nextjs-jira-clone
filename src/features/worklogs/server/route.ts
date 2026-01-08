import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createWorklogSchema, getWorklogsSchema, updateWorklogSchema, Worklog } from "@/features/worklogs/schema";
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
  .get(
    "/:worklogId",
    sessionMiddleware,
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");

      const { worklogId } = c.req.param();

      // Get the worklog
      const worklog = await databases.getDocument<Worklog>(
        DATABASE_ID,
        WORKLOGS_ID,
        worklogId
      );

      // Get task to verify workspace access
      const task = await databases.getDocument(
        DATABASE_ID,
        TASKS_ID,
        worklog.taskId
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

      // Populate user info for the worklog
      const memberDoc = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        worklog.memberId
      );

      const userData = await users.get(memberDoc.userId);
      const populatedWorklog = {
        ...worklog,
        member: {
          ...memberDoc,
          name: userData.name || userData.email,
          email: userData.email,
        },
      };

      return c.json({ data: populatedWorklog });
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
  )
  .patch(
    "/:worklogId",
    sessionMiddleware,
    zValidator("json", updateWorklogSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { worklogId } = c.req.param();
      const { efforts, date, description } = c.req.valid("json");

      // Get the worklog
      const worklog = await databases.getDocument<Worklog>(
        DATABASE_ID,
        WORKLOGS_ID,
        worklogId
      );

      // Verify the worklog belongs to the current user
      if (worklog.userId !== user.$id) {
        return c.json(
          { error: HTTP_STATUS.UNAUTHORISED.MESSAGE },
          HTTP_STATUS.UNAUTHORISED.STATUS
        );
      }

      // Verify task exists and user has access
      const task = await databases.getDocument(
        DATABASE_ID,
        TASKS_ID,
        worklog.taskId
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

      // Update the worklog
      const updateData: Partial<Worklog> = {};
      if (efforts !== undefined) updateData.efforts = efforts;
      if (date !== undefined) updateData.date = date.toISOString();
      if (description !== undefined) updateData.description = description;

      const updatedWorklog = await databases.updateDocument<Worklog>(
        DATABASE_ID,
        WORKLOGS_ID,
        worklogId,
        updateData
      );

      return c.json({ data: updatedWorklog });
    }
  )
  .delete(
    "/:worklogId",
    sessionMiddleware,
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { worklogId } = c.req.param();

      // Get the worklog
      const worklog = await databases.getDocument<Worklog>(
        DATABASE_ID,
        WORKLOGS_ID,
        worklogId
      );

      // Verify the worklog belongs to the current user
      if (worklog.userId !== user.$id) {
        return c.json(
          { error: HTTP_STATUS.UNAUTHORISED.MESSAGE },
          HTTP_STATUS.UNAUTHORISED.STATUS
        );
      }

      // Verify task exists and user has access
      const task = await databases.getDocument(
        DATABASE_ID,
        TASKS_ID,
        worklog.taskId
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

      // Delete the worklog
      await databases.deleteDocument(
        DATABASE_ID,
        WORKLOGS_ID,
        worklogId
      );

      return c.json({ data: { success: true } });
    }
  );

export default app;
