import "server-only";

import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { Account, Client, Databases, Models, Storage } from "node-appwrite";
import { AUTH_COOKIE, HTTP_STATUS } from "@/constants/api";

import {
  type Account as AccountType,
  type Users as UsersType,
  type Databases as DatabasesType,
  type Storage as StorageType,
} from "node-appwrite";

type SessionContext = {
  Variables: {
    account: AccountType;
    databases: DatabasesType;
    storage: StorageType;
    users: UsersType;
    user: Models.User<Models.Preferences>
  };
};

export const sessionMiddleware = createMiddleware<SessionContext>(async (c, next) => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = getCookie(c, AUTH_COOKIE);

  if (!session) {
    return c.json(
      { error: HTTP_STATUS.UNAUTHORISED.MESSAGE },
      HTTP_STATUS.UNAUTHORISED.STATUS
    );
  }

  client.setSession(session);

  const account = new Account(client);
  const databases = new Databases(client);
  const storage = new Storage(client);

  const user = await account.get();

  c.set("account", account);
  c.set("databases", databases);
  c.set("storage", storage);
  c.set("user", user);

  await next();
});
