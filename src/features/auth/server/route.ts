import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { SignInFormSchema, SignUpFormSchema } from "../schema";
import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";

const app = new Hono()
  .post("/sign-in", zValidator("json", SignInFormSchema), async (c) => {
    return c.json({ success: "ok" });
  })
  .post("/sign-up", zValidator("json", SignUpFormSchema), async (c) => {
    const { name, email, password } = c.req.valid('json');

    const { account } = await createAdminClient();
    const user = await account.create(ID.unique(), email, password, name)

    return c.json({ success: "ok" });
  });

export default app;
