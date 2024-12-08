"use server";

import { AUTH_COOKIE } from "@/constants/api";
import { cookies } from "next/headers";
import { Account, Client, Models } from "node-appwrite";

export const getCurrent =
  async (): Promise<Models.User<Models.Preferences> | null> => {
    try {
      const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

      const session = await cookies();
      const authCookie = session.get(AUTH_COOKIE)?.value;

      if(!authCookie) return null;
      
      client.setSession(authCookie);
      const account = new Account(client);
      return await account.get();
    } catch (e) {
      console.log(`e -- `, e)
      return null;
    }
  };
