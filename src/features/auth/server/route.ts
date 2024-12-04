import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { SignInFormSchema, SignUpFormSchema } from "../schema";

const app = new Hono()
  .post("/sign-in", zValidator("json", SignInFormSchema), (c) => {
    return c.json({ success: "ok" });
  })
  .post("/sign-up", zValidator("json", SignUpFormSchema), (c) => {
    const { name, email, password } = c.req.valid('json');
    return c.json({ success: "ok" });
  });

export default app;
