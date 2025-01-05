import 'server-only';

import { Client, Databases, Account, Storage, Users } from "node-appwrite";
import { cookies } from 'next/headers';
import { AUTH_COOKIE, HTTP_STATUS } from '@/constants/api';

export async function createSessionClient() {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = await cookies();
    const authCookie = session.get(AUTH_COOKIE)?.value;

    if (!authCookie) {
      throw new Error(HTTP_STATUS.UNAUTHORISED.MESSAGE);
    }

    client.setSession(authCookie);

    return {
      get account() {
        return new Account(client);
      },
      get databases() {
        return new Databases(client);
      }
    }
}

export const createAdminClient: () => Promise<{account: Account, users: Users}> = async () => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.APP_WRITE_API_KEY!);

    return {
      get account() {
        return new Account(client);
      },
      get users() {
        return new Users(client);
      }
    }
};
