import { z } from "zod";
import { Models } from "node-appwrite";

export type Worklog = Models.Document & IWorklog;

export interface IWorklog {
  $id?: string;
  taskId: string;
  userId: string;
  memberId: string;
  workspaceId: string;
  efforts: number; // in minutes
  date: string; // ISO date string
  description?: string;
}

export const createWorklogSchema = z.object({
  taskId: z.string().trim().min(1, "Required"),
  workspaceId: z.string().trim().min(1, "Required"),
  efforts: z.coerce.number().int().positive("Efforts must be a positive number"),
  date: z.coerce.date(),
  description: z.string().optional(),
});

export const getWorklogsSchema = z.object({
  taskId: z.string().trim().min(1, "Required"),
});

export const updateWorklogSchema = z.object({
  efforts: z.coerce.number().int().positive("Efforts must be a positive number").optional(),
  date: z.coerce.date().optional(),
  description: z.string().optional(),
});