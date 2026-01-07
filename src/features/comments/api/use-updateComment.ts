import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useTranslations } from "next-intl";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.comments[":commentId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.comments[":commentId"]["$patch"]>;

export const useUpdateComment = () => {
  const translations = useTranslations("Task");
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.comments[":commentId"]["$patch"]({
        param,
        json,
      });

      if (!response.ok) {
        throw new Error("failed_to_update_comment");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success(translations("comment_updated") || "Comment updated successfully");
      queryClient.invalidateQueries({ queryKey: ["comments", data.taskId] });
    },
    onError: () => {
      toast.error(translations("failed_to_update_comment") || "Failed to update comment");
    }
  });

  return mutation;
};

