import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { HTTP_STATUS } from "@/constants/api";
import { getMembers } from "@/features/members/types/utils";
import { sessionMiddleware } from "@/middlewares/session";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import {
  createProjectSchema,
  getProjectsListSchema,
  updateProjectSchema,
} from "@/features/projects/schema";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { Project } from "@/features/projects/types";
import { MemberRole } from "@/features/members/types";
import { TASK_STATUS } from "@/features/tasks/constants";

const app = new Hono()
  .get(
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

      const projects = await databases.listDocuments<Project>(DATABASE_ID, PROJECTS_ID, [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ]);

      return c.json({
        data: projects,
      });
    }
  )
  .get("/:projectId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { projectId } = c.req.param();

    const projectInfo = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMembers({
      databases,
      workspaceId: projectInfo?.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json(
        { error: HTTP_STATUS.UNAUTHORISED.MESSAGE },
        HTTP_STATUS.UNAUTHORISED.STATUS
      );
    }

    return c.json({
      data: projectInfo,
    });
  })
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, image, workspaceId } = c.req.valid("form");

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

      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name,
          imageUrl: uploadedImageUrl,
          workspaceId,
        }
      );

      return c.json({ data: project });
    }
  )
  .patch(
    "/:projectId",
    zValidator("form", updateProjectSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { projectId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const existingProject = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );

      if (!existingProject) {
        return c.json(
          { error: HTTP_STATUS.UNAUTHORISED.MESSAGE },
          HTTP_STATUS.UNAUTHORISED.STATUS
        );
      }

      const member = await getMembers({
        databases,
        workspaceId: existingProject.workspaceId,
        userId: user?.$id,
      });

      if (!member) {
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

      const project = await databases.updateDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
        {
          name,
          imageUrl: uploadedImageUrl,
        }
      );

      return c.json({ data: project });
    }
  )
  .delete("/:projectId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");

    const { projectId } = c.req.param();

    const existingProject = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    if (!existingProject) {
      return c.json(
        { error: HTTP_STATUS.UNAUTHORISED.MESSAGE },
        HTTP_STATUS.UNAUTHORISED.STATUS
      );
    }

    const member = await getMembers({
      databases,
      workspaceId: existingProject.workspaceId,
      userId: user?.$id,
    });

    if (!member || member?.role !== MemberRole.ADMIN) {
      return c.json(
        { error: HTTP_STATUS.UNAUTHORISED.MESSAGE },
        HTTP_STATUS.UNAUTHORISED.STATUS
      );
    }

    const project = await databases.deleteDocument(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    return c.json({ data: project });
  })
  .get("/:projectId/analytics", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMembers({
      databases,
      workspaceId: project.workspaceId,
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
        Query.equal("projectId", project.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", project.$id),
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
        Query.equal("projectId", project.$id),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", project.$id),
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
        Query.equal("projectId", project.$id),
        Query.notEqual("status", TASK_STATUS.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", project.$id),
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
        Query.equal("projectId", project.$id),
        Query.equal("status", TASK_STATUS.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", project.$id),
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
        Query.equal("projectId", project.$id),
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
        Query.equal("projectId", project.$id),
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
