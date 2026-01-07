import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useTranslations } from "next-intl";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.comments[":commentId"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.comments[":commentId"]["$delete"]>;

export const useDeleteComment = () => {
  const translations = useTranslations("Task");
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType & { taskId: string }>({
    mutationFn: async ({ param }) => {
      const response = await client.api.comments[":commentId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        throw new Error("failed_to_delete_comment");
      }

      return await response.json();
    },
    onSuccess: (_, variables) => {
      toast.success(translations("comment_deleted") || "Comment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["comments", variables.taskId] });
    },
    onError: () => {
      toast.error(translations("failed_to_delete_comment") || "Failed to delete comment");
    }
  });

  return mutation;
};

