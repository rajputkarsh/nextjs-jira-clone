import { z } from "zod";
import { Models } from "node-appwrite";

export interface IComment {
  $id?: string;
  taskId: string;
  userId: string;
  message: string;
  deletedAt?: string | null;
  $createdAt?: string;
  $updatedAt?: string;
}

export type Comment = Models.Document & IComment;

export interface CommentWithUser extends Comment {
  user: {
    name: string;
    email: string;
  };
}

export const createCommentSchema = z.object({
  taskId: z.string().trim().min(1, "Required"),
  message: z.string().trim().min(1, "Comment cannot be empty"),
});

export const updateCommentSchema = z.object({
  message: z.string().trim().min(1, "Comment cannot be empty"),
});

export const getCommentsSchema = z.object({
  taskId: z.string().trim().min(1, "Required"),
});

