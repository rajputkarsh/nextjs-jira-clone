
import { z } from 'zod';

export interface ICreateWorkspace {
  name: string;
  imageUrl?: string;
}

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z.union([
    z.instanceof(File),
    z.string().transform((value) => value === "" ? undefined : value)
  ]).optional(),
});

export const createWorkspaceFormDefaultValues: ICreateWorkspace = {
  name: "",
  imageUrl: "",
};