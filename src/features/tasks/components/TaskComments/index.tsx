"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DottedSeparator } from "@/components/dotter-separator";
import { useGetComments } from "@/features/comments/api/use-getComments";
import { useCreateComment } from "@/features/comments/api/use-createComment";
import { useUpdateComment } from "@/features/comments/api/use-updateComment";
import { useDeleteComment } from "@/features/comments/api/use-deleteComment";
import { useCurrentUser } from "@/features/auth/api/use-currentUser";
import { useTranslations } from "next-intl";
import { Task } from "@/features/tasks/schema";
import { PencilIcon, XIcon, CheckIcon, TrashIcon } from "lucide-react";
import { CommentWithUser } from "@/features/comments/schema";
import useConfirm from "@/hooks/use-confirm";

interface TaskCommentsProps {
  task: Task;
}

function CommentItem({ comment, taskId }: { comment: CommentWithUser; taskId: string }) {
  const translate = useTranslations("Task");
  const { data: currentUser } = useCurrentUser();
  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment();
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.message);

  const [DeleteDialog, confirmDelete] = useConfirm(
    translate("delete_comment") || "Delete Comment",
    translate("this_action_cannot_be_undone") || "This action cannot be undone.",
    "destructive"
  );

  const isOwnComment = currentUser?.$id === comment.userId;
  const isEdited = comment.$createdAt && comment.$updatedAt && 
    comment.$createdAt !== comment.$updatedAt;

  const handleSave = () => {
    if (!editText.trim() || editText.trim() === comment.message) {
      setIsEditing(false);
      setEditText(comment.message);
      return;
    }

    updateComment(
      {
        param: { commentId: comment.$id! },
        json: { message: editText.trim() },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(comment.message);
  };

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;

    deleteComment({
      param: { commentId: comment.$id! },
      taskId,
    });
  };

  return (
    <>
      <DeleteDialog />
      <div className="flex gap-3">
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
          {isEdited && (
            <span className="text-xs text-muted-foreground italic">
              ({translate("edited") || "edited"})
            </span>
          )}
          {isOwnComment && !isEditing && (
            <div className="flex gap-1 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => setIsEditing(true)}
              >
                <PencilIcon className="size-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-amber-700 hover:text-amber-800"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <TrashIcon className="size-3" />
              </Button>
            </div>
          )}
        </div>
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <Textarea
              disabled={isUpdating}
              value={editText}
              rows={3}
              onChange={(e) => setEditText(e.target.value)}
              className="text-sm"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={handleSave}
                disabled={isUpdating || !editText.trim()}
              >
                <CheckIcon className="size-3 mr-1" />
                {translate("save") || "Save"}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleCancel}
                disabled={isUpdating}
              >
                <XIcon className="size-3 mr-1" />
                {translate("cancel") || "Cancel"}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-foreground whitespace-pre-wrap break-words">
            {comment.message}
          </p>
        )}
      </div>
    </div>
    </>
  );
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
            <CommentItem key={comment.$id} comment={comment} taskId={task.$id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskComments;

