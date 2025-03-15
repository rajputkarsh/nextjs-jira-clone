import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/middlewares/session";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
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
  );

export default app;
