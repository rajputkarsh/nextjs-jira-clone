
import { z } from 'zod';

export interface ICreateWorkspace {
  name: string;
}

export const createWorkspaceSchema = z.object({
  email: z.string().trim().min(1, "Required"),
});

export const createWorkspaceFormDefaultValues: ICreateWorkspace = {
  name: "",
};