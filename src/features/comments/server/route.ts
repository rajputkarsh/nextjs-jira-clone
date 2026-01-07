import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createCommentSchema, updateCommentSchema, Comment, CommentWithUser } from "@/features/comments/schema";
import { sessionMiddleware } from "@/middlewares/session";
import { getMembers } from "@/features/members/types/utils";
import { HTTP_STATUS } from "@/constants/api";
import { DATABASE_ID, COMMENTS_ID, TASKS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite";
import { Task } from "@/features/tasks/schema";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ taskId: z.string() })),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const currentUser = c.get("user");

      const { taskId } = c.req.valid("query");

      // Verify task exists and user has access
      const task = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId
      );

      const member = await getMembers({
        databases,
        workspaceId: task.workspaceId,
        userId: currentUser.$id,
      });

      if (!member) {
        return c.json(
          { error: HTTP_STATUS.UNAUTHORISED.MESSAGE },
          HTTP_STATUS.UNAUTHORISED.STATUS
        );
      }

      // Get all non-deleted comments for this task
      const comments = await databases.listDocuments<Comment>(
        DATABASE_ID,
        COMMENTS_ID,
        [
          Query.equal("taskId", taskId),
          Query.isNull("deletedAt"),
          Query.orderAsc("$createdAt"),
        ]
      );

      // Populate user information for each comment
      const populatedComments: CommentWithUser[] = await Promise.all(
        comments.documents.map(async (comment) => {
          const user = await users.get(comment.userId);
          return {
            ...comment,
            user: {
              name: user.name || user.email,
              email: user.email,
            },
          };
        })
      );

      return c.json({ data: populatedComments });
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createCommentSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { taskId, message } = c.req.valid("json");

      // Verify task exists and user has access
      const task = await databases.getDocument<Task>(
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

      // Create the comment
      const comment = await databases.createDocument<Comment>(
        DATABASE_ID,
        COMMENTS_ID,
        ID.unique(),
        {
          taskId,
          userId: user.$id,
          message,
        }
      );

      // Get user information for the comment
      const { users } = await createAdminClient();
      const userInfo = await users.get(user.$id);

      const populatedComment: CommentWithUser = {
        ...comment,
        user: {
          name: userInfo.name || userInfo.email,
          email: userInfo.email,
        },
      };

      return c.json({ data: populatedComment });
    }
  )
  .patch(
    "/:commentId",
    sessionMiddleware,
    zValidator("json", updateCommentSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { commentId } = c.req.param();
      const { message } = c.req.valid("json");

      // Get the comment
      const comment = await databases.getDocument<Comment>(
        DATABASE_ID,
        COMMENTS_ID,
        commentId
      );

      // Verify the comment belongs to the current user
      if (comment.userId !== user.$id) {
        return c.json(
          { error: HTTP_STATUS.UNAUTHORISED.MESSAGE },
          HTTP_STATUS.UNAUTHORISED.STATUS
        );
      }

      // Verify task exists and user has access
      const task = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        comment.taskId
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

      // Update the comment
      const updatedComment = await databases.updateDocument<Comment>(
        DATABASE_ID,
        COMMENTS_ID,
        commentId,
        {
          message,
        }
      );

      // Get user information for the comment
      const { users } = await createAdminClient();
      const userInfo = await users.get(user.$id);

      const populatedComment: CommentWithUser = {
        ...updatedComment,
        user: {
          name: userInfo.name || userInfo.email,
          email: userInfo.email,
        },
      };

      return c.json({ data: populatedComment });
    }
  )
  .delete(
    "/:commentId",
    sessionMiddleware,
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { commentId } = c.req.param();

      // Get the comment
      const comment = await databases.getDocument<Comment>(
        DATABASE_ID,
        COMMENTS_ID,
        commentId
      );

      // Verify the comment belongs to the current user
      if (comment.userId !== user.$id) {
        return c.json(
          { error: HTTP_STATUS.UNAUTHORISED.MESSAGE },
          HTTP_STATUS.UNAUTHORISED.STATUS
        );
      }

      // Verify task exists and user has access
      const task = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        comment.taskId
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

      // Soft delete the comment by setting deletedAt
      await databases.updateDocument<Comment>(
        DATABASE_ID,
        COMMENTS_ID,
        commentId,
        {
          deletedAt: new Date().toISOString(),
        }
      );

      return c.json({ data: { $id: commentId } });
    }
  );

export default app;

