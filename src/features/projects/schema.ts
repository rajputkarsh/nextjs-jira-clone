import { z } from 'zod';

export const getProjectsListSchema = z.object({ workspaceId: z.string().trim() });