"use server";

import { createSessionClient } from "@/lib/appwrite";
import { Models } from "node-appwrite";

export const getCurrent =
  async (): Promise<Models.User<Models.Preferences> | null> => {
    try {

      const { account } = await createSessionClient();

      return await account.get();
    } catch (e) {
      return null;
    }
  };
