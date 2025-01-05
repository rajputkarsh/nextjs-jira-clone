import { Hono } from "hono";
import { z } from "zod";
import { sessionMiddleware } from "@/middlewares/session";
import { zValidator } from "@hono/zod-validator";
import { createAdminClient } from "@/lib/appwrite";
import { getMembers } from "@/features/members/types/utils";
import { HTTP_STATUS } from "@/constants/api";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Query } from "node-appwrite";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string().trim() })),
     async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");

      const { workspaceId } = c.req.valid("query");

      const member = await getMembers({
        databases,
        workspaceId,
        userId: user.$id
      });

      if(!member) {
        return c.json(
          { error: HTTP_STATUS.UNAUTHORISED.MESSAGE },
          HTTP_STATUS.UNAUTHORISED.STATUS
        );
      }

      const members = await databases.listDocuments(
        DATABASE_ID, 
        MEMBERS_ID, 
        [
          Query.equal("workspaceId", workspaceId),
        ]
      );

      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name,
            email: user.email,
          }
        })
      );

      return c.json({ data: { ...members, documents: populatedMembers } });

     }
  );

export default app;
