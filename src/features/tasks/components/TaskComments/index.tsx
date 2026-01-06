"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DottedSeparator } from "@/components/dotter-separator";
import { useGetComments } from "@/features/comments/api/use-getComments";
import { useCreateComment } from "@/features/comments/api/use-createComment";
import { useTranslations } from "next-intl";
import { Task } from "@/features/tasks/schema";

interface TaskCommentsProps {
  task: Task;
}

function TaskComments({ task }: TaskCommentsProps) {
  const translate = useTranslations("Task");
  const { data: comments, isLoading } = useGetComments({ taskId: task.$id });
  const { mutate: createComment, isPending } = useCreateComment();
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    createComment(
      {
        json: {
          taskId: task.$id,
          message: commentText.trim(),
        },
      },
      {
        onSuccess: () => {
          setCommentText("");
        },
      }
    );
  };

  return (
    <div className="p-4 border rounded-lg">
      <p className="text-lg font-semibold mb-4">
        {translate("comments") || "Comments"}
      </p>
      <DottedSeparator className="my-4" />

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <Textarea
          disabled={isPending}
          placeholder={translate("add_a_comment") || "Add a comment..."}
          value={commentText}
          rows={3}
          onChange={(e) => setCommentText(e.target.value)}
          className="mb-3"
        />
        <Button
          type="submit"
          size="sm"
          className="w-fit ml-auto"
          disabled={isPending || !commentText.trim()}
        >
          {isPending
            ? translate("posting") || "Posting..."
            : translate("post_comment") || "Post Comment"}
        </Button>
      </form>

      <DottedSeparator className="my-4" />

      {/* Comments List */}
      {isLoading ? (
        <div className="text-sm text-muted-foreground">
          {translate("loading_comments") || "Loading comments..."}
        </div>
      ) : !comments || comments.length === 0 ? (
        <div className="text-sm text-muted-foreground text-center py-8">
          {translate("no_comments") || "No comments yet. Be the first to comment!"}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <div key={comment.$id} className="flex gap-3">
              <Avatar className="size-8 shrink-0">
                <AvatarFallback className="bg-neutral-200 font-medium text-neutral-600">
                  {comment.user.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold">{comment.user.name}</p>
                  <span className="text-xs text-muted-foreground">
                    {comment.$createdAt &&
                      formatDistanceToNow(new Date(comment.$createdAt), {
                        addSuffix: true,
                      })}
                  </span>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                  {comment.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskComments;

