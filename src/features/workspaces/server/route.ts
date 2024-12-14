import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/middlewares/session";
import { createWorkspaceSchema } from "../schema";

const app = new Hono()
  .post(
    "/",
    zValidator("json", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {

    }
  )

export default app;