import 'server-only';

import { Client, Databases, Account, Storage, Users } from "node-appwrite";

export const createAdminClient: () => Promise<{account: Account}> = async () => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.APP_WRITE_API_KEY!);

    return {
      get account() {
        return new Account(client);
      }
    }
};
