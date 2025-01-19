import { z } from "zod";

export const getProjectsListSchema = z.object({
  workspaceId: z.string().trim(),
});

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  workspaceId: z.string(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});
