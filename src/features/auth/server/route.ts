import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { SignInFormSchema } from "../schema";

const app = new Hono()
  .post("/sign-in", zValidator("json", SignInFormSchema), (c) => {
    return c.json({ success: "ok" });
  });

export default app;
