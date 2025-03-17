import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/middlewares/session";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  TASKS_ID,
  WORKSPACES_ID,
} from "@/config";
import {
  createWorkspaceSchema,
  joinWorkspaceSchema,
  updateWorkspaceSchema,
} from "@/features/workspaces/schema";
import { MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";
import { WORKSPACE_INVITE_CODE_LENGTH } from "@/features/workspaces/constants";
import { getMembers } from "@/features/members/types/utils";
import { HTTP_STATUS } from "@/constants/api";
import { Workspace } from "@/features/workspaces/types";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TASK_STATUS } from "@/features/tasks/constants";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (!members.documents.length) {
      return c.json({ data: { documents: [], total: 0 } });
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.contains("$id", workspaceIds), Query.orderDesc("$createdAt")]
    );

    return c.json({ data: workspaces });
  })
  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { workspaceId } = c.req.param();

    const member = await getMembers({
      databases,
      workspaceId,
      userId: user?.$id,
    });

    if (!member) {
      return c.json(
        { error: HTTP_STATUS.UNAUTHORISED.MESSAGE },
        HTTP_STATUS.UNAUTHORISED.STATUS
      );
    }

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return c.json({ data: workspace });
  })
  .get("/:workspaceId/info", sessionMiddleware, async (c) => {
    const databases = c.get("databases");

    const { workspaceId } = c.req.param();

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return c.json({
      data: {
        $id: workspace.$id,
        name: workspace.name,
        imageUrl: workspace.imageUrl,
      },
    });
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, image } = c.req.valid("form");

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
          inviteCode: generateInviteCode(WORKSPACE_INVITE_CODE_LENGTH),
        }
      );

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      });

      return c.json({ data: workspace });
    }
  )
  .patch(
    "/:workspaceId",
    zValidator("form", updateWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { workspaceId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const member = await getMembers({
        databases,
        workspaceId,
        userId: user?.$id,
      });

      if (!member || member?.role !== MemberRole.ADMIN) {
        return c.json(
          { error: HTTP_STATUS.UNAUTHORISED.MESSAGE },
          HTTP_STATUS.UNAUTHORISED.STATUS
        );
      }

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      } else {
        uploadedImageUrl = image;
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          name,
          imageUrl: uploadedImageUrl,
        }
      );

      return c.json({ data: workspace });
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMembers({
      databases,
      workspaceId,
      userId: user?.$id,
    });

    if (!member || member?.role !== MemberRole.ADMIN) {
      return c.json(
        { error: HTTP_STATUS.UNAUTHORISED.MESSAGE },
        HTTP_STATUS.UNAUTHORISED.STATUS
      );
    }

    // TODO: Delete members, projects and tasks

    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return c.json({ data: { $id: workspaceId } });
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMembers({
      databases,
      workspaceId,
      userId: user?.$id,
    });

    if (!member || member?.role !== MemberRole.ADMIN) {
      return c.json(
        { error: HTTP_STATUS.UNAUTHORISED.MESSAGE },
        HTTP_STATUS.UNAUTHORISED.STATUS
      );
    }

    const workspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
      { inviteCode: generateInviteCode(WORKSPACE_INVITE_CODE_LENGTH) }
    );

    return c.json({ data: workspace });
  })
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", joinWorkspaceSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { workspaceId } = c.req.param();
      const { code } = c.req.valid("json");

      const member = await getMembers({
        databases,
        workspaceId,
        userId: user?.$id,
      });

      if (member) {
        return c.json(
          { error: HTTP_STATUS.CONFLICT.MESSAGE },
          HTTP_STATUS.CONFLICT.STATUS
        );
      }

      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      );

      if (workspace?.inviteCode !== code) {
        return c.json(
          { error: HTTP_STATUS.BAD_REQUEST.MESSAGE },
          HTTP_STATUS.BAD_REQUEST.STATUS
        );
      }

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.MEMBER,
      });

      return c.json({ data: workspace });
    }
  )

  .get("/:workspaceId/analytics", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { workspaceId } = c.req.param();

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

    const now = new Date();

    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);

    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const thisMonthTaskCount = thisMonthTasks.total;
    const lastMonthTaskCount = lastMonthTasks.total;

    const taskDifference = thisMonthTaskCount - lastMonthTaskCount;

    const thisMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const thisMonthAssignedTaskCount = thisMonthAssignedTasks.total;
    const lastMonthAssignedTaskCount = lastMonthAssignedTasks.total;

    const assignedTaskDifference =
      thisMonthAssignedTaskCount - lastMonthAssignedTaskCount;

    const thisMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TASK_STATUS.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TASK_STATUS.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const thisMonthIncompleteTaskCount = thisMonthIncompleteTasks.total;
    const lastMonthIncompleteTaskCount = lastMonthIncompleteTasks.total;

    const incompleteTaskDifference =
      thisMonthIncompleteTaskCount - lastMonthIncompleteTaskCount;

    const thisMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TASK_STATUS.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TASK_STATUS.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const thisMonthCompletedTaskCount = thisMonthCompletedTasks.total;
    const lastMonthCompletedTaskCount = lastMonthCompletedTasks.total;

    const completedTaskDifference =
      thisMonthCompletedTaskCount - lastMonthCompletedTaskCount;

    const thisMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TASK_STATUS.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TASK_STATUS.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const thisMonthOverdueTaskCount = thisMonthOverdueTasks.total;
    const lastMonthOverdueTaskCount = lastMonthOverdueTasks.total;

    const overdueTaskDifference =
      thisMonthOverdueTaskCount - lastMonthOverdueTaskCount;

    return c.json({
      data: {
        taskCount: thisMonthTaskCount,
        taskDifference,
        assignedTaskCount: thisMonthAssignedTaskCount,
        assignedTaskDifference,
        completedTaskCount: thisMonthCompletedTaskCount,
        completedTaskDifference,
        incompleteTaskCount: thisMonthIncompleteTaskCount,
        incompleteTaskDifference,
        overdueTaskCount: thisMonthOverdueTaskCount,
        overdueTaskDifference,
      },
    });
  });

export default app;
