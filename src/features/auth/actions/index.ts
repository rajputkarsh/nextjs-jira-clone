"use server";

import { cookies } from "next/headers";
import { Account, Client, Models } from "node-appwrite";

export const getCurrent =
  async (): Promise<Models.User<Models.Preferences> | null> => {
    try {
      const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

      const session = await cookies();

      if (!session) return null;

      const account = new Account(client);

      return await account.get();
    } catch (e) {
      return null;
    }
  };
