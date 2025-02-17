import { z } from "zod";
import { TASK_STATUS } from "./constants";
import { Models } from "node-appwrite";

export type Task = Models.Document & Exclude<ITask, 'workspaceId'>;

export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';

export interface ITask {
  workspaceId: string;
  name: string;
  projectId: string;
  assigneeId: string;
  dueDate: string;
  status: TaskStatus;
  position?: Number;
  description?: string;
}

export const getTaskSchema = z.object({
  workspaceId: z.string(),
  projectId: z.string().nullish(),
  assigneeId: z.string().nullish(),
  status: z.nativeEnum(TASK_STATUS).nullish(),
  search: z.string().nullish(),
  dueDate: z.string().nullish(),
});

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  assigneeId: z.string().trim().min(1, "Required"),
  dueDate: z.coerce.date(),
  status: z.nativeEnum(TASK_STATUS, { required_error: "Required" }),
  description: z.string().optional(),
});

export const createTaskFormDefaultValues: z.infer<typeof createTaskSchema> = {
  workspaceId: "",
  name: "",
  projectId: "",
  assigneeId: "",
  dueDate: new Date(),
  status: TASK_STATUS.TODO,
  description: "",
};
